import randomstring from 'randomstring';

import channelService from './channel';

import { Coupon } from '@/entities';
import { CouponCreateError, CouponNotFoundError } from '@/errors/coupon';
import {
  CreateVoucherDocument,
  DiscountValueTypeEnum,
  FindVouchersDocument,
  UpdateVoucherChannelListingDocument,
  VoucherTypeEnum,
} from '@/gql/graphql';
import { executeGraphQL } from '@/helpers/graphql';
import { executeQuery } from '@/helpers/queryRunner';

class CouponService {
  private async createSaleorVoucher(
    voucherCode: string,
    discountValueType: DiscountValueTypeEnum,
    discountValue: number
  ) {
    const channel = await channelService.getDefault();

    const { voucherCreate } = await executeGraphQL(CreateVoucherDocument, {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: {
        input: {
          singleUse: true,
          discountValueType,
          type: VoucherTypeEnum.EntireOrder,
          startDate: new Date().toISOString(),
          addCodes: [voucherCode],
        },
      },
    });

    if (!voucherCreate || voucherCreate.errors.length > 0) {
      throw new CouponCreateError(voucherCreate?.errors);
    }

    const { voucherChannelListingUpdate } = await executeGraphQL(
      UpdateVoucherChannelListingDocument,
      {
        withAuth: false,
        headers: {
          Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
        },
        variables: {
          id: voucherCreate.voucher!.id,
          input: {
            addChannels: [
              {
                channelId: channel.id,
                discountValue,
              },
            ],
          },
        },
      }
    );

    if (!voucherChannelListingUpdate || voucherChannelListingUpdate.errors.length > 0) {
      throw new CouponCreateError(voucherChannelListingUpdate?.errors);
    }

    return voucherChannelListingUpdate.voucher!;
  }
  async createReferAFriendCoupon(userId: string) {
    const code = randomstring.generate({ charset: 'alphanumeric' });
    const voucher = await this.createSaleorVoucher(code, DiscountValueTypeEnum.Fixed, 50);
    await executeQuery(async (queryRunner) => {
      const coupon = queryRunner.manager.create(Coupon, {
        code,
        saleorCouponId: voucher.id,
        user: {
          id: userId,
        },
      });
      await queryRunner.manager.save(coupon);
    });
    return { voucher, code };
  }
  async getCoupons(userId: string) {
    const entities = await executeQuery(async (queryRunner) =>
      queryRunner.manager.find(Coupon, { where: { user: { id: userId } } })
    );
    const { vouchers } = await executeGraphQL(FindVouchersDocument, {
      withAuth: false,
      headers: {
        Authorization: `Bearer ${process.env.SALEOR_APP_TOKEN}`,
      },
      variables: {
        filter: {
          ids: entities.map((entity) => entity.saleorCouponId),
        },
      },
    });

    if (!vouchers) {
      throw new CouponNotFoundError();
    }
    return vouchers.edges.map(({ node: voucher }) => ({
      voucher,
      entity: entities.find((entity) => entity.saleorCouponId === voucher.id),
    }));
  }
}

const couponService = new CouponService();

export default couponService;

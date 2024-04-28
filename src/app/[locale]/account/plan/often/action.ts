'use server';

import { getLoginedMe } from '@/actions';
import { RecurringBox, User } from '@/entities';
import { OrderSize } from '@/enums';
import Joi from 'joi';
import { executeQuery } from '@/helpers/queryRunner';
import { getNumericEnumValues } from '@/helpers/enum';
import { getCalendarEvents } from '@/services/calendar';
import { In } from 'typeorm';
import { isBefore, startOfDay } from 'date-fns';

interface SetOrderSizeAction {
  size: OrderSize;
}

const schema = Joi.object<SetOrderSizeAction>({
  size: Joi.valid(...getNumericEnumValues(OrderSize)).required(),
});

export default async function setOrderSizeAction(data: SetOrderSizeAction) {
  const { value, error } = schema.validate(data);

  if (error) {
    throw new Error('schema is not valid');
  }

  const events = await getCalendarEvents();
  const me = await getLoginedMe();
  const today = startOfDay(new Date());

  await executeQuery(async (queryRunner) => {
    const data = await queryRunner.manager.findOne(User, {
      where: {
        id: me.id,
      },
      relations: {
        dogs: {
          boxs: {
            shipment: true,
          },
        },
      },
      order: {
        dogs: {
          boxs: {
            shipment: {
              deliveryDate: -1,
            },
          },
        },
      },
    });

    if (!data) {
      throw new Error('user not found');
    }

    data.orderSize = value.size;

    const updatableBoxIds = [];
    for (const dog of data.dogs) {
      const editableBox = dog.boxs.find(
        (box) => box.order === undefined && !isBefore(today, box.shipment.editableDeadline)
      );
      if (editableBox) {
        updatableBoxIds.push(editableBox.id);
      }
    }
    await queryRunner.manager.update(
      RecurringBox,
      { id: In(updatableBoxIds) },
      { orderSize: value.size }
    );

    await queryRunner.manager.save(data);
  });
}

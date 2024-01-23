import Container from '@/components/Container';
import { FragmentProps } from '@/components/FragmentRouter';
import H2 from '@/components/Heading/H2';
import { Route } from '../types';
import UnderlineButton from '@/components/UnderlineButton';

export default function OrdersFragment({ navigate }: FragmentProps<Route>) {
  return (
    <div className="py-10">
      <Container>
        <H2 inline className="text-center text-primary">
          Orders
        </H2>
        <div className="border-gray mx-auto mt-6 max-w-[680px] overflow-hidden rounded-3xl border">
          <table className="w-full">
            <thead className="bg-gray text-white">
              <tr>
                <th className="px-2 py-4">Order</th>
                <th className="px-2 py-4">Delivery Date</th>
                <th className="px-2 py-4">Status</th>
                <th className="px-2 py-4">Bill Total</th>
                <th className="px-2 py-4">Invoice</th>
              </tr>
            </thead>
            <tbody className="bg-white text-center">
              <tr>
                <td className="px-2 py-3">[R1234]</td>
                <td className="px-2 py-3">[DD/MM/YY]</td>
                <td className="px-2 py-3">[Order Scheduled]</td>
                <td className="px-2 py-3">[$500]</td>
                <td className="px-2 py-3">
                  <UnderlineButton label="See Details" />
                </td>
              </tr>
              <tr className="border-t-gray border-t">
                <td className="px-2 py-3">[R1234]</td>
                <td className="px-2 py-3">[DD/MM/YY]</td>
                <td className="px-2 py-3">[Order Processing]</td>
                <td className="px-2 py-3">[$500]</td>
                <td className="px-2 py-3">
                  <UnderlineButton label="See Details" />
                </td>
              </tr>
              <tr className="border-t-gray border-t">
                <td className="px-2 py-3">[R1234]</td>
                <td className="px-2 py-3">[DD/MM/YY]</td>
                <td className="px-2 py-3">[Delivered]</td>
                <td className="px-2 py-3">[$500]</td>
                <td className="px-2 py-3">
                  <UnderlineButton label="See Details" />
                </td>
              </tr>
              <tr className="border-t-gray border-t">
                <td colSpan={5} className="px-2 py-3">
                  <UnderlineButton label="Load More" className="!text-primary" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-8 text-center">
          <UnderlineButton type="button" onClick={() => navigate(-1)} label="Go Back" />
        </div>
      </Container>
    </div>
  );
}

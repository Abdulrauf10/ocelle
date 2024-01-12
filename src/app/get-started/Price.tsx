interface PriceProps {
  price: number;
  discountedPrice?: number;
}

export default function Price({ price, discountedPrice }: PriceProps) {
  if (!discountedPrice) {
    return (
      <>
        [<span className="text-[#269D9E]">${price}</span>]
      </>
    );
  }
  return (
    <>
      [<span className="text-[#f00] line-through">${price}</span>{' '}
      <span className="font-bold text-[#269D9E]">${discountedPrice}</span>]
    </>
  );
}

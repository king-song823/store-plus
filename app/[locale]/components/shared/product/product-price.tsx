import { RMB } from '@/lib/constants';
import { cn } from '@/lib/utils';

const ProductPrice = ({
  value,
  className,
}: {
  value: number;
  className?: string;
}) => {
  const stringValue = value.toFixed(2);
  const [intValue, floatValue] = stringValue.split('.');

  return (
    <p className={cn('text-2xl', className)}>
      <span className="text-xs align-super">{RMB}</span>
      {intValue}
      <span className="text-xs align-super">.{floatValue}</span>
    </p>
  );
};

export default ProductPrice;

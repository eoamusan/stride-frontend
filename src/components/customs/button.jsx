import { Button } from "../ui/button";

const CustomButton = ({
  children,
  type,
  variant,
  onClick,
  className,
}) => {
  return (
    <Button
      type={type}
      variant={variant}
      onClick={onClick}
      className={`h-10 rounded-xl text-xs w-full md:w-auto ${className}`}
    >
      {children}
    </Button>
  );
};

export default CustomButton;

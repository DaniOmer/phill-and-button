import Image, { StaticImageData } from "next/image";

import images from "@/constants/images";

export interface ProductCardProps {
  image: StaticImageData;
  name: string;
  price: string;
}

const ProductCard = () => {
  return (
    <div className="flex flex-col gap-2">
      <Image src={images.Phill} alt="Mannequin" />
      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold">Jacket FO2</span>
        <span className="text-sm font-medium">25.000 FCFA</span>
      </div>
      <p className="text-sm">
        Jacket velour kaki. Jacket velour kaki. Jacket velour kaki. Jacket
        velour kaki. Jacket velour kaki. Jacket velour kaki. Jacket velour kaki.
      </p>
    </div>
  );
};
export default ProductCard;

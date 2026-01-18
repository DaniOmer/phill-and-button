import Image from "next/image";

import images from "@/constants/images";
import { Button } from "../ui/button";
import { MoveRight } from "lucide-react";

const Banner = () => {
  return (
    <section className="mt-10">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 mb-7">
        <p className="col-span-2 flex-1 text-5xl xl:text-6xl uppercase xl:leading-[5rem]">
          Le style parfait commence <br /> avec des choix audacieux
        </p>
        <div className="flex flex-col justify-end gap-4 py-4">
          <p className="text-base uppercase">
            Découvre les nouvelles tendances Phill&Button qui donnent du
            caractère à ton dressing.
          </p>
          <Button
            className="flex items-center gap-10 py-5 rounded-full border-black"
            variant="outline"
          >
            <span>Voir les nouveautés</span>
            <MoveRight />
          </Button>
        </div>
      </div>
      <div>
        <Image
          src={images.Banner}
          alt="Good looking man wearing a suit"
          className="h-[400px] object-cover"
        />
      </div>
    </section>
  );
};
export default Banner;

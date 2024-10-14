import { assets, faqs } from "../assets/assets";
import FaqItems from "./FaqItems";

const Faq = () => {
  return (
    <div className="max-w-full w-[1440px] p-10 mx-auto bg-blue-50 rounded-xl">
      <div className="flex justify-between w-full gap-[50px] lg:gap-0 ">
        <div className="w-[40%] hidden md:block">
          <img src={assets.faq_img} alt="" />
        </div>

        <div className="w-full md:w-1/2">
          <h2 className="text-2xl font-medium text-gray-900">
            Most questions by our beloved patients
          </h2>

          <ul className="mt-[38px]">
            {faqs.map((item, index) => (
              <FaqItems item={item} key={index} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Faq;

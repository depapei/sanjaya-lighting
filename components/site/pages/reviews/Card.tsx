type ReviewCardProps = {
  children?: React.ReactNode;
  content: string;
  title: string;
};

const ReviewCard = (props: ReviewCardProps) => {
  const { children, content, title } = props;
  return (
    <div className="flex flex-col items-center justify-center rounded-md border border-[#E5E7EB] bg-[#F6F6F6] px-6 py-[30px] text-center">
      <div className="mb-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#E5E7EB] bg-white text-black [&>svg]:h-5 [&>svg]:w-5">
        {children}
      </div>
      <p className="pb-1 text-2xl font-bold leading-[1.21] tracking-[0px] text-black md:text-[32px] md:leading-[1.19]">
        {content}
      </p>
      <h3 className="text-sm font-normal leading-[1.43] text-[#6B6B6B]">
        {title}
      </h3>
    </div>
  );
};

export default ReviewCard;

type ReviewCardProps = {
  children?: React.ReactNode;
  content: string;
  title: string;
};

const ReviewCard = (props: ReviewCardProps) => {
  const { children, content, title } = props;
  return (
    <div className='px-6 py-12 rounded-md flex flex-col justify-center items-center hover:shadow-2xl transition-all border-in bg-gray-900 hover:bg-gray-800'>
      {children}
      <p 
        className='text-xl md:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-amber-600 to-amber-400 bg-clip-text text-transparent pb-1'
      >
        {content}
      </p>
      <h1 
        className='text-md md:text-lg lg:text-xl font-semibold tracking-tight text-gray-200'
      >
        {title}
      </h1>
    </div>
  )
};

export default ReviewCard;
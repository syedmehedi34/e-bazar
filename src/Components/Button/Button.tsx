

type buttonProps = {
    type?:'button' | 'submit'| 'reset' ,
    text?:string,
    Icon?: string,
    className?: string,
    action?: ()=>void
}

const Button: React.FC<buttonProps> =  ({ type = 'button', text, Icon, className, action }) => {
  return (
    <button type={type} className={`${className} bg-gray-900 text-white px-5 md:py-3 py-2 font-bold rubik rounded-md hover:bg-gray-700 transition-all duration-300 cursor-pointer`} onClick={action} >
      {Icon && <Icon />} 
      {text}
    </button>
  );
};

export default Button;



type buttonProps = {
    type?:'button' | 'submit'| 'reset' ,
    text?:string,
    Icon?: string,
    className?: string,
    action?: ()=>void
}

const Button: React.FC<buttonProps> =  ({ type = 'button', text, Icon, className, action }) => {
  return (
    <button type={type} className={`${className} bg-gray-800 text-white px-5 py-3 font-bold rubik rounded-md hover:bg-red-500/ transition-all duration-300 cursor-pointer`} onClick={action} >
      {Icon && <Icon />} 
      {text}
    </button>
  );
};

export default Button;

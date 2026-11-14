type Props = {
  children: React.ReactNode,
}

const Toggler = ({ children }: Props) => {
  return (<>{children}</>);
};


Toggler.displayName = 'Toggler';
export default Toggler;
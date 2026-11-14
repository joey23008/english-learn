type Props = {
  children: React.ReactNode,
}

const Content = ({ children }: Props) => {
  return (<>{children}</>);
};


Content.displayName = 'Content';
export default Content;
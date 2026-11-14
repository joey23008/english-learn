import { mapParts } from "@/utils";
import styles from './styles.module.scss';
import classNames from "classnames";
import { useEffect, useState } from "react";

type Props = {
  children: JSX.Element[],
  open: boolean,
}

const Accordion = ({
  children,
  open,
}: Props) => {
  const [toggler, content] = mapParts(children, ['Toggler', 'Content']);
  const [contentDisp, setContentDisp] = useState(open);
  const [contentOpen, setContentOpen] = useState(false);

  useEffect(() => {
    if (open) {
      setContentDisp(true);
      setTimeout(() => setContentOpen(true));
    } else {
      setContentOpen(false);
      setTimeout(() => setContentDisp(false), 500);
    }
  }, [open, setContentOpen, setContentDisp]);
  
  return (
    <>
      {toggler}
      {
        contentDisp ? (
          <div
            className={classNames({
              [styles['content']]: true,
              [styles['is-open']]: contentOpen,
            })}
          >
            {content}
          </div>
        ) : null
      }
    </>
  );
};


Accordion.displayName = 'Accordion';
export default Accordion;
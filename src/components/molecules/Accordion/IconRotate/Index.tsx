import styles from './styles.module.scss';
import classNames from "classnames";
import { useFirstRender } from "@/hooks/FirstRender";
import Accordion from "../Index";
import Toggler from '../Toggler/Index';
import Content from '../Content/Index';
import React, { useCallback, useEffect, useState } from "react";
export { Content };

type Props = {
  renderIcon: React.ReactNode,
  togglerIcoEnable?: boolean,
  toggler: (props: ParentProps) => React.ReactNode,
  content: React.ReactNode,
  open?: boolean,
  onToggle?: (next: boolean) => void,
}

type ParentProps = {
  onClick: () => void,
}

const BasicAccordion = ({
  renderIcon, togglerIcoEnable=true, toggler, content, open: parentOpen=true, onToggle,
}: Props) => {
  const isFirst = useFirstRender();
  const [open, setOpen] = useState(true);
  const handleOnClick = useCallback(() => {
    let next = false;
    setOpen(prev => {
      next = !prev;
      return next;
    });
    if (onToggle) {
      onToggle(next);
    }
  }, [setOpen, onToggle]);
  useEffect(() => setOpen(parentOpen), [parentOpen]);
  
  return (
    <Accordion
      open={open}
    >
      <Toggler>
        <div className={classNames(styles['toggler'])}>
          {toggler({onClick: handleOnClick})}
          {
            togglerIcoEnable ? (
              <div
                className={
                  classNames({
                    'toggler-icon': true,
                    [styles['icon']]: true,
                    [styles['rotate-up']]: !isFirst && open,
                    [styles['rotate-down']]: !isFirst && !open,
                  })
                }
              >
                {renderIcon}
              </div>
            ) : null
          }
        </div>
      </Toggler>
      <Content>
        {content}
      </Content>
    </Accordion>
  );
};


BasicAccordion.displayName = 'BasicAccordion';
export default BasicAccordion;
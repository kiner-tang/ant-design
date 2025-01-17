import classNames from 'classnames';
import React, { useContext, useMemo } from 'react';
import warning from '../_util/warning';
import { ConfigContext } from '../config-provider';
import type { FormItemStatusContextProps } from '../form/context';
import { FormItemInputContext } from '../form/context';
import useStyle from './style';

export interface GroupProps {
  className?: string;
  size?: 'large' | 'small' | 'default';
  children?: React.ReactNode;
  style?: React.CSSProperties;
  onMouseEnter?: React.MouseEventHandler<HTMLSpanElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLSpanElement>;
  onFocus?: React.FocusEventHandler<HTMLSpanElement>;
  onBlur?: React.FocusEventHandler<HTMLSpanElement>;
  prefixCls?: string;
  compact?: boolean;
}

const Group: React.FC<GroupProps> = (props) => {
  const { getPrefixCls, direction } = useContext(ConfigContext);
  const { prefixCls: customizePrefixCls, className = '' } = props;
  const prefixCls = getPrefixCls('input-group', customizePrefixCls);
  const inputPrefixCls = getPrefixCls('input');
  const [wrapSSR, hashId] = useStyle(inputPrefixCls);
  const cls = classNames(
    prefixCls,
    {
      [`${prefixCls}-lg`]: props.size === 'large',
      [`${prefixCls}-sm`]: props.size === 'small',
      [`${prefixCls}-compact`]: props.compact,
      [`${prefixCls}-rtl`]: direction === 'rtl',
    },
    hashId,
    className,
  );

  const formItemContext = useContext(FormItemInputContext);

  const groupFormItemContext = useMemo<FormItemStatusContextProps>(
    () => ({
      ...formItemContext,
      isFormItemInput: false,
    }),
    [formItemContext],
  );

  if (process.env.NODE_ENV !== 'production') {
    warning(
      false,
      'Input.Group',
      `'Input.Group' is deprecated. Please use 'Space.Compact' instead.`,
    );
  }

  return wrapSSR(
    <span
      className={cls}
      style={props.style}
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      onFocus={props.onFocus}
      onBlur={props.onBlur}
    >
      <FormItemInputContext.Provider value={groupFormItemContext}>
        {props.children}
      </FormItemInputContext.Provider>
    </span>,
  );
};

export default Group;

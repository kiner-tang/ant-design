import classNames from 'classnames';
import toArray from 'rc-util/lib/Children/toArray';
import pickAttrs from 'rc-util/lib/pickAttrs';
import React from 'react';
import { cloneElement } from '../_util/reactNode';
import warning from '../_util/warning';
import { ConfigContext } from '../config-provider';
import type { BreadcrumbItemProps } from './BreadcrumbItem';
import BreadcrumbItem, { InternalBreadcrumbItem } from './BreadcrumbItem';
import BreadcrumbSeparator from './BreadcrumbSeparator';

import useStyle from './style';
import useItemRender from './useItemRender';
import useItems from './useItems';

export interface BreadcrumbItemType {
  key?: React.Key;
  /**
   * Different with `path`. Directly set the link of this item.
   */
  href?: string;
  /**
   * Different with `href`. It will concat all prev `path` to the current one.
   */
  path?: string;
  title?: React.ReactNode;
  /* @deprecated Please use `title` instead */
  breadcrumbName?: string;
  menu?: BreadcrumbItemProps['menu'];
  /** @deprecated Please use `menu` instead */
  overlay?: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement | HTMLSpanElement>;

  /** @deprecated Please use `menu` instead */
  children?: Omit<BreadcrumbItemType, 'children'>[];
}
export interface BreadcrumbSeparatorType {
  type: 'separator';
  separator?: React.ReactNode;
}

export type ItemType = Partial<BreadcrumbItemType & BreadcrumbSeparatorType>;

export type InternalRouteType = Partial<BreadcrumbItemType & BreadcrumbSeparatorType>;

export interface BreadcrumbProps {
  prefixCls?: string;
  params?: any;
  separator?: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  rootClassName?: string;
  children?: React.ReactNode;

  /** @deprecated Please use `items` instead */
  routes?: ItemType[];

  items?: ItemType[];

  itemRender?: (
    route: ItemType,
    params: any,
    routes: ItemType[],
    paths: string[],
  ) => React.ReactNode;
}

const getPath = (params: any, path?: string) => {
  if (path === undefined) {
    return path;
  }

  let mergedPath = (path || '').replace(/^\//, '');
  Object.keys(params).forEach((key) => {
    mergedPath = mergedPath.replace(`:${key}`, params[key]!);
  });
  return mergedPath;
};

const Breadcrumb = (props: BreadcrumbProps) => {
  const {
    prefixCls: customizePrefixCls,
    separator = '/',
    style,
    className,
    rootClassName,
    routes: legacyRoutes,
    items,
    children,
    itemRender,
    params = {},
    ...restProps
  } = props;

  const { getPrefixCls, direction } = React.useContext(ConfigContext);

  let crumbs: React.ReactNode;
  const prefixCls = getPrefixCls('breadcrumb', customizePrefixCls);
  const [wrapSSR, hashId] = useStyle(prefixCls);

  const mergedItems = useItems(items, legacyRoutes);

  if (process.env.NODE_ENV !== 'production') {
    warning(!legacyRoutes, 'Breadcrumb', '`routes` is deprecated. Please use `items` instead.');
  }

  const mergedItemRender = useItemRender(prefixCls, itemRender);

  if (mergedItems && mergedItems.length > 0) {
    // generated by route
    const paths: string[] = [];

    const itemRenderRoutes: any = items || legacyRoutes;

    crumbs = mergedItems.map((item, index) => {
      const {
        path,
        key,
        type,
        menu,
        overlay,
        onClick,
        className: itemClassName,
        separator: itemSeparator,
      } = item;
      const mergedPath = getPath(params, path);

      if (mergedPath !== undefined) {
        paths.push(mergedPath);
      }

      const mergedKey = key ?? index;

      if (type === 'separator') {
        return <BreadcrumbSeparator key={mergedKey}>{itemSeparator}</BreadcrumbSeparator>;
      }

      const itemProps: BreadcrumbItemProps = {};
      const isLastItem = index === mergedItems.length - 1;

      if (menu) {
        itemProps.menu = menu;
      } else if (overlay) {
        itemProps.overlay = overlay as any;
      }

      if (itemClassName) {
        itemProps.className = itemClassName;
      }

      let { href } = item;
      if (paths.length && mergedPath !== undefined) {
        href = `#/${paths.join('/')}`;
      }

      return (
        <InternalBreadcrumbItem
          key={mergedKey}
          {...itemProps}
          {...pickAttrs(item, {
            data: true,
            aria: true,
          })}
          href={href}
          separator={isLastItem ? '' : separator}
          onClick={onClick}
          prefixCls={prefixCls}
        >
          {mergedItemRender(item as BreadcrumbItemType, params, itemRenderRoutes, paths, href)}
        </InternalBreadcrumbItem>
      );
    });
  } else if (children) {
    const childrenLength = toArray(children).length;
    crumbs = toArray(children).map((element: any, index) => {
      if (!element) {
        return element;
      }
      // =================== Warning =====================
      if (process.env.NODE_ENV !== 'production') {
        warning(
          !element,
          'Breadcrumb',
          '`Breadcrumb.Item and Breadcrumb.Separator` is deprecated. Please use `items` instead.',
        );
      }
      warning(
        element.type &&
          (element.type.__ANT_BREADCRUMB_ITEM === true ||
            element.type.__ANT_BREADCRUMB_SEPARATOR === true),
        'Breadcrumb',
        "Only accepts Breadcrumb.Item and Breadcrumb.Separator as it's children",
      );
      const isLastItem = index === childrenLength - 1;
      return cloneElement(element, {
        separator: isLastItem ? '' : separator,
        key: index,
      });
    });
  }

  const breadcrumbClassName = classNames(
    prefixCls,
    {
      [`${prefixCls}-rtl`]: direction === 'rtl',
    },
    className,
    rootClassName,
    hashId,
  );

  return wrapSSR(
    <nav className={breadcrumbClassName} style={style} {...restProps}>
      <ol>{crumbs}</ol>
    </nav>,
  );
};

Breadcrumb.Item = BreadcrumbItem;
Breadcrumb.Separator = BreadcrumbSeparator;

if (process.env.NODE_ENV !== 'production') {
  Breadcrumb.displayName = 'Breadcrumb';
}

export default Breadcrumb;

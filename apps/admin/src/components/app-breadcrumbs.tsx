import { Link, useMatches } from "@tanstack/react-router";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "./ui/breadcrumb";
import clsx from "clsx";
import { Fragment } from "react/jsx-runtime";

type Breadcrumb = {
  title: string;
  path?: string;
};

export default function AppBreadcrumbs() {
  const routes = useMatches();
  const breadcrumbs: Breadcrumb[] = [];
  for (const route of routes) {
    const { breadcrumb, path } = route.context as {
      breadcrumb?: string;
      path?: string;
    };
    if (breadcrumb) {
      breadcrumbs.push({
        title: breadcrumb,
        path,
      });
    }
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbs.map((breadcrumb, index, array) => (
          <Fragment key={breadcrumb.title}>
            <BreadcrumbItem
              className={clsx({
                hidden: index < array.length - 1,
                "md:block": index < array.length - 1,
                "text-foreground": index === array.length - 1,
                "hover:text-normal": !!breadcrumb.path,
              })}
            >
              <BreadcrumbLink asChild>
                {breadcrumb.path ? (
                  <Link to={breadcrumb.path}>{breadcrumb.title}</Link>
                ) : (
                  <div className="hover:text-muted-foreground">
                    {breadcrumb.title}
                  </div>
                )}
              </BreadcrumbLink>
            </BreadcrumbItem>
            {index < array.length - 1 ? (
              <BreadcrumbSeparator className="hidden md:block" />
            ) : null}
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

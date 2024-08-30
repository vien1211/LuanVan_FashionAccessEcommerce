import React from "react";
import useBreadcrumbs from "use-react-router-breadcrumbs";
import { Link } from "react-router-dom";
import { IoIosArrowForward } from "react-icons/io";

const Breadcrumb = ({ title, category }) => {
  // Define routes to be used for breadcrumbs
  const routes = [
    { path: "/:category", breadcrumb: category },
    { path: "/:category/:pid/:title", breadcrumb: title },
    { path: "/", breadcrumb: "Home" },
  ];

  // Use the breadcrumbs hook
  const breadcrumbs = useBreadcrumbs(routes);

  return (
    <div className="text-sm flex items-center">
      {breadcrumbs
        ?.filter((el) => !el.match.route === false)
        .map(({ match, breadcrumb }, index, self) => (
          <React.Fragment key={match.pathname}>
            <Link className="flex items-center hover:text-main" to={match.pathname}>
              <span className='capitalize'>{breadcrumb}</span>
            </Link>
            {index < self.length - 1 && <IoIosArrowForward className="mx-2" />}
          </React.Fragment>
        ))}
    </div>
  );
};

export default Breadcrumb;

import React from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

function withRouter(WrappedComponent) {
  return function WithRouterWrapper(props) {
    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();

    return (
      <WrappedComponent
        {...props}
        navigate={navigate}
        params={params}
        location={location}
        history={{
          push: navigate,
          replace: (path) => navigate(path, { replace: true }),
        }}
        match={{ params }}
      />
    );
  };
}

export default withRouter;

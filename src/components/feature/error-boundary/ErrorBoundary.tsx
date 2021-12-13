import * as React from "react";
import ebCSS from "./ErrorBoundary.module.scss";

export interface AppErrorBoundaryProps {}

export interface AppErrorBoundaryState {}

class AppErrorBoundary extends React.Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state = { hasError: false };

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className={ebCSS.errorBoundary}>
          <h4>Something went wrong. Please try reloading the page.</h4>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;

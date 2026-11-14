import React from 'react';
import { STATUS, MSG_ERR, URL } from '@/consts';
import { useError } from '@/hooks/useError';
import { CustomError } from '@/providers/ErrorProvider';

type WithErrorProps = {
  error: CustomError | null;
  setError: (error: Error | null) => void;
};

function withCustomHook<P>(Component: React.ComponentType<P & WithErrorProps>) {
  return function WrappedComponent(props: P) {
    const { error, setError } = useError();
    return <Component {...props} error={error} setError={setError} />;
  };
}

type Props = {
  children: React.ReactNode,
}

type State = {
  hasError: boolean
}

class ErrorBoundary extends React.Component<Props & WithErrorProps, State> {
  constructor(props: Props & WithErrorProps) {
    super(props);

    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }
  
  componentDidCatch() {
    // TODO エラーのロギング処理を実装する
  }

  render() {

    if (this.state.hasError || this.props.error) {
      let message: string = MSG_ERR.APP_ERROR;
      if (this.props.error) {
        if (this.props.error.name === 'FetchError') {
          if (this.props.error.status === STATUS.UNAUTHORIZED) {
            location.href = `${URL.LOGIN}?prev-path=${location.pathname + location.search}`;
          } else if (this.props.error.status === STATUS.INTERNAL_SERVER_ERROR) {
            message = MSG_ERR.SERVER_ERROR;
          } else if (this.props.error.request) {
            message = MSG_ERR.NETWORK_ERROR;
          }
        }
      }

      return (
        <div>
          <h2>{message}</h2>
          <button
            type="button"
            onClick={() => {
              if (this.props.error) {
                this.props.setError(null);
              } else {
                this.setState({ hasError: false });
              }
            }}
          >
            Try again?
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default withCustomHook<Props>(ErrorBoundary);
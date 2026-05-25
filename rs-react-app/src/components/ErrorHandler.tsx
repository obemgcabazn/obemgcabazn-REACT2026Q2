import './error-handler.scss';

interface ErrorProps {
  errorData: Error;
}

const ErrorHandler = (props: ErrorProps) => {
  const getMessage = () => {
    switch (props.errorData.message) {
      case '404':
        return 'Pokemon not found';
      case '400':
        return 'Bad request';
      case '500':
        return 'Server error, try again later';
      default:
        return props.errorData.message;
    }
  };

  return (
    <div className="container">
      <p className="error-message">{getMessage()}</p>
      <button className="button__main" onClick={() => window.location.reload()}>
        Reload Page
      </button>
    </div>
  );
};
export default ErrorHandler;

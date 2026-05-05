import './error-handler.scss';
import { PureComponent } from 'react';

interface ErrorProps {
  errorData: Error;
}

export default class ErrorHandler extends PureComponent<ErrorProps> {
  getMessage() {
    switch (this.props.errorData.message) {
      case '404':
        return 'Pokemon not found';
      case '400':
        return 'Bad request';
      case '500':
        return 'Server error, try again later';
      default:
        return this.props.errorData.message;
    }
  }

  render() {
    return (
      <div className="text-center">
        <p className="error-message">{this.getMessage()}</p>
        <button onClick={() => window.location.reload()}>Reload Page</button>
      </div>
    );
  }
}

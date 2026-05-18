import { Component } from 'react';

class Thrower extends Component {
  render(): never | undefined {
    throw new Error('Test Error');
    // istanbul ignore next
    return;
  }
}

interface TestErrorState {
  shouldThrow: boolean;
}

export default class TestError extends Component<
  Record<string, never>,
  TestErrorState
> {
  state: TestErrorState = { shouldThrow: false };

  handleClick = () => {
    this.setState({ shouldThrow: true });
  };

  render() {
    if (this.state.shouldThrow) {
      return <Thrower />;
    }
    return (
      <button className="button__main" onClick={this.handleClick}>
        Test Error
      </button>
    );
  }
}

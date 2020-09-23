import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Badge, Button, Collapse } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown, faCaretRight } from '@fortawesome/free-solid-svg-icons';

import Clipboard from '../shared/Clipboard';

import PlatformConfig from './PlatformConfig';

class Test extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      clipboardVisible: null,
      detailsShowing: false,
    };
  }

  componentDidMount() {
    const { selectedTest, testGroup, test } = this.props;

    if (testGroup && selectedTest === test.id) {
      this.setState({ detailsShowing: true });
    }
  }

  setClipboardVisible = (key) => {
    this.setState({ clipboardVisible: key });
  };

  toggleDetails = () => {
    let { detailsShowing } = this.state;
    const { updateParamsAndState, test } = this.props;

    detailsShowing = !detailsShowing;
    if (detailsShowing) {
      updateParamsAndState({
        selectedTest: test.id,
        selectedTaskId: '',
      });
    }
    this.setState({
      detailsShowing,
    });
  };

  getGroupHtml = (text) => {
    const splitter = text.includes('/') ? '/' : ':';
    const parts = text.split(splitter);

    if (splitter === '/') {
      const bolded = parts.pop();

      return (
        <span>
          {parts.join(splitter)}
          {splitter}
          <strong data-testid="group-slash-bolded">{bolded}</strong>
        </span>
      );
    }

    const bolded = parts.shift();

    return (
      <span>
        <strong data-testid="group-colon-bolded">{bolded}</strong>
        {splitter}
        {parts.join(splitter)}
      </span>
    );
  };

  render() {
    const {
      test: { key, id, tests },
      revision,
      notify,
      currentRepo,
      groupedBy,
      jobs,
      selectedJobName,
      selectedTaskId,
      updateParamsAndState,
    } = this.props;
    const { clipboardVisible, detailsShowing } = this.state;

    return (
      <div>
        <div key={id} data-testid="test-grouping">
          <span
            className="d-flex w-100 p-2"
            onMouseEnter={() => this.setClipboardVisible(key)}
            onMouseLeave={() => this.setClipboardVisible(null)}
          >
            <Button
              onClick={this.toggleDetails}
              className="text-break text-wrap border-0 d-flex text-left"
              title="Click to expand for test detail"
              outline
            >
              <FontAwesomeIcon
                icon={detailsShowing ? faCaretDown : faCaretRight}
                className="mr-2 min-width-1 mt-1"
              />
              <span>
                {key === 'none' ? 'All' : this.getGroupHtml(key)}
                <span className="ml-2">
                  ({tests.length} failure{tests.length > 1 && 's'})
                </span>
              </span>
            </Button>
            <Clipboard
              text={key}
              description="group text"
              visible={clipboardVisible === key}
            />
          </span>

          <Collapse isOpen={detailsShowing}>
            {tests.map((failure) => (
              <PlatformConfig
                key={failure.key}
                failure={failure}
                jobs={jobs}
                currentRepo={currentRepo}
                revision={revision}
                notify={notify}
                groupedBy={groupedBy}
                selectedJobName={selectedJobName}
                selectedTaskId={selectedTaskId}
                updateParamsAndState={(stateObj) => {
                  stateObj.selectedTest = id;
                  updateParamsAndState(stateObj);
                }}
                className="ml-3"
              />
            ))}
          </Collapse>
        </div>
      </div>
    );
  }
}

Test.propTypes = {
  test: PropTypes.shape({
    key: PropTypes.string.isRequired,
    tests: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  groupedBy: PropTypes.string.isRequired,
  revision: PropTypes.string.isRequired,
  currentRepo: PropTypes.shape({}).isRequired,
  notify: PropTypes.func.isRequired,
};

export default Test;

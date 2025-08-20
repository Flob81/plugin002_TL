import React, {useEffect, useState, useCallback} from 'react';
import {view} from '@forge/bridge';
import styled from 'styled-components';
import Form, {FormHeader, FormSection, FormFooter, Field} from '@atlaskit/form';
import Select from '@atlaskit/select';
import Button, {ButtonGroup} from '@atlaskit/button';
import SectionMessage from '@atlaskit/section-message';

const Content = styled.div`
  margin: ${({ isIssueView }) => isIssueView ? '24px 24px 0' : 0};
`;

function App() {
  const [extensionData, setExtensionData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    view.getContext().then(({extension}) => {
      setExtensionData(extension);
    });
  }, []);

  const formValueSubmit = useCallback(async (value) => {
    try {
      return await view.submit(value);
    } catch (e) {
      setError("Couldn't save the custom field");
    }
  }, [view]);

  const onSubmit = useCallback(async (formData) => {
    await formValueSubmit(formData.fieldValue);
  }, [formValueSubmit]);

  const isIssueView = extensionData?.renderContext && extensionData.renderContext === 'issue-view';

  if (!extensionData) {
    return <>{'Loading...'}</>;
  }

  const configuration = extensionData.configuration || {};
  const options = [
    { value: 'none', label: `⚪️ ${configuration.noneLabel || ''}` },
    { value: 'red', label: `🔴 ${configuration.redLabel || ''}` },
    { value: 'yellow', label: `🟡 ${configuration.yellowLabel || ''}` },
    { value: 'green', label: `🟢 ${configuration.greenLabel || ''}` }
  ];

  const defaultValue = options.find(o => o.value === extensionData.fieldValue) || options[0];

  return (
      <Content isIssueView={isIssueView}>
        <Form onSubmit={onSubmit}>
          {({formProps, dirty, submitting}) => {
            if (isIssueView) {
              return (
                  <form {...formProps}>
                    <FormHeader title="Edit field"/>
                    <FormSection>
                      {error && <SectionMessage appearance="error">{error}</SectionMessage>}
                      <Field name="fieldValue" label="Traffic light" defaultValue={defaultValue.value}>
                        {({fieldProps}) => (
                          <Select
                            {...fieldProps}
                            options={options}
                            defaultValue={defaultValue}
                          />
                        )}
                      </Field>
                    </FormSection>
                    <FormFooter>
                      <ButtonGroup>
                        <Button type="submit" appearance="primary" isDisabled={!dirty || submitting}>
                          Submit
                        </Button>
                        <Button appearance="subtle" onClick={view.close}>
                          Cancel
                        </Button>
                      </ButtonGroup>
                    </FormFooter>
                  </form>
              )
            }
            return (
                <form {...formProps}>
                  {error && <SectionMessage appearance="error">{error}</SectionMessage>}
                  <Field name="fieldValue" label="Traffic light" defaultValue={defaultValue.value}>
                    {({fieldProps}) => (
                      <Select
                        {...fieldProps}
                        options={options}
                        defaultValue={defaultValue}
                        onChange={(opt) => {
                          fieldProps.onChange(opt.value);
                          formValueSubmit(opt.value);
                        }}
                      />
                    )}
                  </Field>
                </form>
            )
          }}
        </Form>
      </Content>
  );
}

export default App;

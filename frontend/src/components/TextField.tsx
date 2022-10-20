import styled from "styled-components";

const TextFieldWrapper = styled.div`
  > label {
    color: ${(props: any) => props.hasError? "rgb(255, 77, 118)" : "#aaa"};
    margin: 0 0 .8em .8em;
  }
` as any;

const TextInput = styled.input`
  background: none;
  border: ${(props: any) => props.hasError? "1px solid rgb(255, 77, 118)" : "none"};
  border-radius: 2rem;
  box-shadow: inset 5px 5px 15px 5px rgba(0, 0, 0, .3);
  box-sizing: border-box;
  color: inherit;
  display: block;
  font-family: inherit;
  font-size: inherit;
  padding: .8em 1.6em;
  width: 100%;
` as any;

const HelperText = styled.div`
  color: ${(props: any) => props.hasError? "rgb(255, 77, 118)" : "inherit"};
  margin: .8em 0 0 .8em;
` as any;

export function TextField(props: { label: string | null, type: string, value: string | undefined, hasError?: boolean, helperText?: string | null, onChange: (e: any) => void, onKeyDown?: (e: any) => void })
 {
    const { label, type, value, hasError, helperText, onChange, onKeyDown } = props;
    
    return <TextFieldWrapper hasError={hasError}>
        <label>{ label }</label>
        <TextInput type={ type } defaultValue={ value } hasError={hasError} onChange={onChange} onKeyDown={onKeyDown}/>
        <HelperText hasError={hasError}>{ helperText }</HelperText>
    </TextFieldWrapper>
}
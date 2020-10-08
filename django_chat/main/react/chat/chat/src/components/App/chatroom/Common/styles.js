import styled from 'styled-components';

export const StyledInput = styled.textarea`
  border: 0px;
  padding: 10px;
  resize: none;
`;

export const StyledBtn = styled.a`
  ${props =>
    props.light
      ? 'background: #27496d;color: white !important;'
      : 'background: #3282b8; color: white !important;'}
  border-radius: 5px;

  border: 2px solid #3282b8;
  padding: 10px;
  cursor: pointer;
  text-align: center;
  ${props =>
    props.right
      ? 'text-align:right;'
      : props.left
      ? 'text-align:left;'
      : 'text-align:center;'}
  &:hover {
  ${props => (props.light ? '' : '')}
`;

export const StyledRoundInput = styled.input`
  background: white;
  border: 1px solid white;
  border: 1px solid white;
  border-radius: 5px;
  padding: 10px;
`;

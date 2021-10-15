import styled from "styled-components";

/*
.chat-close {
	background: #1b2126;
	border-radius: 50%;
	color: #fff;
	display: block;
	float: right;
	font-size: 10px;
	height: 16px;
	line-height: 16px;
	margin: 2px 0 0 0;
	text-align: center;
	width: 16px;
}

.chat {
	background: #fff;
}







.chat-feedback {
	font-style: italic;
	margin: 0 0 0 80px;
}



*/

export const StyleTextInput = styled.input`
  border: 1px solid #ccc;
  border-radius: 3px;
  padding: 8px;
  outline: none;
  width: 234px;
`;

export const StyledForm = styled.form`
  padding: 24px;
  fieldset {
    border: 0;
    margin: 0;
    padding: 0;
  }
`;

export const StyleWebsocketStatus = styled.h5`
  position: absolute;
  padding: 5px 10px;
  width: 100%;
`;

export const StyledReferenceList = styled.ul`
  padding: 0px;
  list-style: none;
  margin-bottom: 0px;
  width: 100%;
  max-height: 100px;
  overflow: auto;
  min-height: 50px;
  li {
    padding: 10px 15px;
    color: #245e7b;
    background: white;
    text-decoration: underline;
    border-bottom: 1px solid lightgray;
  }
`;

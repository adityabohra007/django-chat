import React from 'react';
import {StyleTextInput, StyledForm,StyledReferenceList} from './style';
import {MdSend} from 'react-icons/md';
const ChatForm = props => {
  return (
    <StyledForm onSubmit={props.onSubmit}>
      <fieldset>
      <UserReference searchword={'adi'}/>
        <StyleTextInput
          type="text"
          placeholder="Enter to Send Message"
          autoFocus
          onChange={props.onChange}
          value={props.value}
        />
      </fieldset>
    </StyledForm>
  );
};

const UserReference = props =>{
    const test =[{value:1,label:'aditya'},{value:2,label:'mohit'},{value:3,label:'papa'}]
    const item = test.filter(data=>{
        if(data.label.includes("adi"))
        {
            console.log("UserReference----------------------")
            return data
        }
    })
    const itemElement = item.map(data =>{
        return <li>@{data.label}</li>
    })
    console.log(item)
    return(
    <StyledReferenceList>
        {itemElement}
</StyledReferenceList>
    )
}
export default ChatForm;

import { Message, Header, List, ListItem } from 'semantic-ui-react'

type Props = {
  heading: string, 
  errors: string[],
};

export function ErrorMessage(props: Props) {
  if (props.errors.length === 0) {
    return null;
  }
  return (
    <Message
      data-testid="errormessage"
      negative
    >
      <Header>{props.heading}</Header>
      <List>
      {props.errors.map((error, i) => 
        <ListItem key={i}>
          {error}
        </ListItem>
      )}
      </List>
  </Message>
  );
}

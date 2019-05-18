import React from 'react';
import { StyleSheet, Text, View, ListView, BackAndroid, Alert } from 'react-native';
import { Container, Content, Header, Form, Input, Item, Button, Label, Title, Icon, Right, List, ListItem, Footer, DatePicker } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { createAppContainer, createStackNavigator, StackActions, NavigationAction } from 'react-navigation';
import * as firebase from 'firebase';


const config = {
  apiKey: "AIzaSyBsvcaTFVE6jXwdE4Ot96nFzv2NZQdZLeM",
  authDomain: "todolist-9b9e1.firebaseapp.com",
  databaseURL: "https://todolist-9b9e1.firebaseio.com",
  projectId: "todolist-9b9e1",
  storageBucket: "todolist-9b9e1.appspot.com",
}

firebase.initializeApp(config);
console.disableYellowBox = true;

class LoginForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      Password: ''
    }
  }

  static navigationOptions = {
    title: 'Todo lists',
  }

  logIn = (email, pass) => {
    var log = false;
    //console.log('done');
    try {
      if (this.state.Password.length < 6) {
        alert("Please enter password more than 6 character");
        return;
      }
      //alert('done')
      firebase.auth().signInWithEmailAndPassword(email, pass).then(() => this.props.navigation.navigate('Main'), (error) => {alert(error);})
    }
    catch (err) {
      alert("Email or Password is not right");
    }
  }

  render() {
    return (
      <Container style={styles.container}>
        <Form>
          <Item floatingLabel>
            <Label>Email</Label>
            <Input autoCorrect={false} autoCapitalize={"none"} 
              onChangeText={(emaiL) => this.setState({email: emaiL})}
            />
          </Item>
          <Item floatingLabel>
            <Label>Password</Label>
            <Input autoCorrect={false} autoCapitalize={"none"} secureTextEntry={true}
              onChangeText={(pass) => this.setState({Password: pass})}
            />
          </Item>
        </Form>
        <Item/>
        <Button
            full
            rounded
            success
            style = {{marginTop: 20}}
            onPress={() => this.logIn(this.state.email,this.state.Password)}
          >
          <Label>Login</Label>
        </Button>
        
        <Button
            full
            rounded
            primary
            style = {{marginTop: 20}}
            onPress={() => this.props.navigation.navigate('SignUp')}
          >
          <Label>Sign up</Label>
        </Button>
      </Container>
    );
  }
}

class SignUPForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      email: '',
      Password: '',
      Confirm: ''
    }
  }

  static navigationOptions = {
    title: 'Todo lists',
  }

  signUpSucces = () => {
    alert('Sign Up Success');
    this.props.navigation.navigate('Main');
  }

  signUp = (email, pass, confirm) => {
    try {
      if (pass < 6) {
        alert("Please enter password more than 6 character");
        return;
      }
      if (confirm != pass) {
        alert("Password and Confirm Password are not matched");
        return;
      }
      firebase.auth().createUserWithEmailAndPassword(email, pass).then(() => this.signUpSucces(), (err) => {alert(err)})
    }
    catch (err) {
      console.log(err)
    }
  }

  render() {
    return (
      <Container style={styles.container}>
        <Form>
          <Item floatingLabel>
            <Label>Email</Label>
            <Input autoCorrect={false} autoCapitalize={"none"} 
              onChangeText={(emaiL) => this.setState({email: emaiL})}
            />
          </Item>
          <Item floatingLabel>
            <Label>Password</Label>
            <Input autoCorrect={false} autoCapitalize={"none"} secureTextEntry={true}
              onChangeText={(pass) => this.setState({Password: pass})}
            />
          </Item>
          <Item floatingLabel>
            <Label>Confirm Password</Label>
            <Input autoCorrect={false} autoCapitalize={"none"} secureTextEntry={true}
              onChangeText={(pass) => this.setState({Confirm: pass})}
            />
          </Item>
        </Form>
        <Item/>
        <Button
            full
            rounded
            primary
            style = {{marginTop: 20}}
            onPress={() => this.signUp(this.state.email,this.state.Password,this.state.Confirm)}
          >
          <Label>Sign up</Label>
        </Button>
      </Container>
    );
  }
}

var data = []

class TodoList extends React.Component {

  constructor(props) {
    super(props);

    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })

    this.state = {
      listViewData: data,
      newContact: ""
    }
  }

  static navigationOptions = {
    title: 'Todo lists',
    headerLeft: null,
  }


  componentDidMount() {

    var that = this
    BackAndroid.addEventListener('hardwareBackPress', () => { 
        return true;
    });
    firebase.database().ref('/todo').on('child_added', function (data) {

      var newData = [...that.state.listViewData]
      newData.push(data)
      that.setState({ listViewData: newData })

    })

  }

  async deleteRow(secId, rowId, rowMap, data) {

    await firebase.database().ref('todo/' + data.key).set(null)

    rowMap[`${secId}${rowId}`].props.closeRow();
    var newData = [...this.state.listViewData];
    newData.splice(rowId, 1)
    this.setState({ listViewData: newData });

  }

  showInformation(data) {
    // console.log(data.val().notes)
    str = data.val().notes + "\n" + data.val().dates;
    alert(str);
  }

  render() {
    return (
      <Container style={styles.contain}>
        <Content>
        <List
            enableEmptySections
            dataSource={this.ds.cloneWithRows(this.state.listViewData)}
            renderRow={data =>
              <ListItem onPress={() => this.showInformation(data)}>
                <Text> {data.val().todo}</Text>
              </ListItem>
            }
            renderLeftHiddenRow={(data, secId, rowId, rowMap) =>
              <Button full onPress={() => this.deleteRow(secId, rowId, rowMap, data).then(() => this.props.navigation.navigate('Change', {data: data}))} >
                <Icon name="information-circle" />
              </Button>
            }
            renderRightHiddenRow={(data, secId, rowId, rowMap) =>
              <Button full danger onPress={() => this.deleteRow(secId, rowId, rowMap, data)}>
                <Icon name="trash" />
              </Button>

            }

            leftOpenValue={75}
            rightOpenValue={-75}

          />
          <Button style={{backgroundColor: 'black'}} onPress={() => this.props.navigation.navigate('Add')} rounded>
          <Icon name="add-circle"></Icon>
          </Button>
        </Content>
        <Footer style={{backgroundColor: 'white'}}>
          <Button style={{backgroundColor: 'black'}} onPress={() => this.props.navigation.navigate('Login')} rounded>
          <Icon name="log-out"></Icon>
          </Button>
        </Footer>
      </Container>
    );
  }
}

class AddForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: '',
      chosenDate: new Date(),
      note: ''
    }
    this.setDate = this.setDate.bind(this);
  }

  setDate(newDate) {
    this.setState({ chosenDate: newDate });
  }

  static navigationOptions = {
    title: 'Add new todo',
  }

  addRow(value, date, note) {

    var key = firebase.database().ref('/todo').push().key
    firebase.database().ref('/todo').child(key).set({ todo: value, dates: date, notes: note }).then(() => this.props.navigation.navigate('Main'));
  }

  render() {
    return (
      <Container>
        <Form>
          <Item floatingLabel>
            <Label>Work To done</Label>
            <Input autoCorrect={false} autoCapitalize={"none"} 
              onChangeText={(text) => this.setState({value: text})}
            />
          </Item>
          <Item floatingLabel>
            <Label>note</Label>
            <Input autoCorrect={false} autoCapitalize={"none"} 
              onChangeText={(notes) => this.setState({note: notes})}
              multiline={true}
              numberOfLines={7}
            />
          </Item>
          <Item>
          <DatePicker
            defaultDate={new Date()}
            minimumDate={new Date()}
            maximumDate={new Date(2020, 12, 31)}
            locale={"en"}
            timeZoneOffsetInMinutes={undefined}
            modalTransparent={false}
            animationType={"fade"}
            androidMode={"default"}
            placeHolderText="Select date"
            textStyle={{ color: "green" }}
            placeHolderTextStyle={{ color: "#d3d3d3" }}
            onDateChange={this.setDate}
            disabled={false}
            style = {{marginTop: 20}}
            />
          </Item>
        </Form>
        <Button
            full
            rounded
            success
            style = {{marginTop: 20}}
            onPress={() => this.addRow(this.state.value, this.state.chosenDate.toString().substr(4, 12), this.state.note)}
          >
          <Label>Add</Label>
        </Button>
      </Container>
    );
  }
}

class ChangeForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: this.props.navigation.getParam('data').val().todo,
      chosenDate: this.props.navigation.getParam('data').val().dates,
      note: this.props.navigation.getParam('data').val().notes
    }
    this.setDate = this.setDate.bind(this);
  }

  setDate(newDate) {
    this.setState({ chosenDate: newDate });
  }

  static navigationOptions = {
    title: 'Change to do',
  }

  async saveData(value, date, note) {
    var key = this.props.navigation.getParam('data').key;
    await firebase.database().ref('todo/' + data.key).set(null)
    key = firebase.database().ref('/todo').push().key
    firebase.database().ref('/todo').child(key).set({ todo: value, dates: date, notes: note }).then(() => this.props.navigation.navigate('Main'));
  }

  render() {
    return (
      <Container>
        <Form>
          <Item floatingLabel>
            <Label>Work To done</Label>
            <Input 
              autoCorrect={false} 
              autoCapitalize={"none"} 
              onChangeText={(text) => this.setState({value: text})}
              value={this.state.value}
            />
          </Item>
          <Item floatingLabel>
            <Label>note</Label>
            <Input autoCorrect={false} autoCapitalize={"none"} 
              onChangeText={(notes) => this.setState({note: notes})}
              multiline={true}
              numberOfLines={7}
              value={this.state.note}
            />
          </Item>
          <Item>
          <DatePicker
            defaultDate={new Date()}
            minimumDate={new Date()}
            maximumDate={new Date(2020, 12, 31)}
            locale={"en"}
            timeZoneOffsetInMinutes={undefined}
            modalTransparent={false}
            animationType={"fade"}
            androidMode={"default"}
            placeHolderText="Select date"
            textStyle={{ color: "green" }}
            placeHolderTextStyle={{ color: "#d3d3d3" }}
            onDateChange={this.setDate}
            disabled={false}
            style = {{marginTop: 20}}
            />
          </Item>
        </Form>
        <Button
            full
            rounded
            success
            style = {{marginTop: 20}}
            onPress={() => this.saveData(this.state.value, this.state.chosenDate.toString().substr(4, 12), this.state.note)}
          >
          <Label>Save</Label>
        </Button>
      </Container>
    );
  }
}

const AppNavigation = createStackNavigator({
  Login: {
    screen: LoginForm,
  },
  Main: {
    screen: TodoList
  },    
  Add: {
    screen: AddForm,
  },
  Change: {
    screen: ChangeForm,
  },
  SignUp: {
    screen: SignUPForm,
  }
},
  {
    initialRouteName: 'Login',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      }
    }
  }
);

const AppContainer = createAppContainer(AppNavigation);

export default class App extends React.Component {
  render() {
    return (
      <AppContainer/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  contain: {
    flex: 1,
    backgroundColor: '#fff',
  }
});

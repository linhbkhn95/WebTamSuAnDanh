var React = require('react');

import {BrowserRouter as Router,Route,Switch,Ridirect,hashHistory,Redirect,NavLink,Link} from 'react-router-dom';


var {Provider} = require('react-redux');

var store = require('app/store.js');
var Test =require('app/components/Test.js');
var Layout = require('app/components/Layout.js');
 var Home = require('app/components/pages/wall/Wall.js');
var Login = require('app/components/pages/login/Login.js');
var ShopCart = require('app/components/pages/shopcart/ShopCart.js');
var ShopMK = require('app/components/pages/shopMK/ShopMK.js');
var UserManager = require('app/components/pages/usershopmanager/UserManager.js');

import OrderStep from  'app/components/pages/shopcart/OrderStep.js';
import DetailProduct from 'app/utils/DetailProduct.js';
import jwt from 'jsonwebtoken';
import jwtDecode from 'jwt-decode';
import setAuthorizationToken from 'app/utils/setAuthorizationToken.js';
import {setCurrentUser} from 'app/action/authActions.js';

import {logout}  from 'app/action/actionAuthenticate.js';
if(localStorage.jwToken){
  console.log('cssssssssssssssssssssssssssmm');
  setAuthorizationToken(localStorage.jwToken);
  store.dispatch(setCurrentUser(jwtDecode(localStorage.jwToken)));
  
}
import {cyan500} from 'material-ui/styles/colors';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
const muiTheme = getMuiTheme({
  palette: {
    textColor: cyan500,
  },
  appBar: {
    height: 50,
  },
});
 class App extends React.Component{
 
// require('style-loader!css-loader!foundation-sites/dist/css/foundation.min.css');
//require('style!css!sass!./css/style.scss');
// $(document).ready(() => $(document).foundation());
      componentDidMount(){
      
      }

     render(){
        return(
          <MuiThemeProvider muiTheme={muiTheme}>
             <Provider store={store}>
              <Router>
                  
                  <Layout>
                  {/* <Link to="/user/login">Đăng nhập</Link>  */}
                 
                 <div>
               
                   <Switch>
                       
                      <Route  exact   path="/" component={UserManager}/>
                      <Route     path="/wall" component={Home}/>
                       {/* <Route  exact   path="/wall" component={Home}/> */}
                      <Route render={function(){
                          return <p> not found</p>
                           }
                       } />
                 </Switch>
                </div>
               </Layout>
             </Router>
             </Provider>
        
            </MuiThemeProvider>
    )
  }
}

module.exports = App;


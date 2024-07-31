'use client';
import React from 'react'

import '../../styles/message.css';
const SideChats = () => {
  return (
<div className="container bootstrap snippets bootdey">
    <div className="row">
		<div className="col-md-4 bg-white sidechat">
            <div className=" row border-bottom padding-sm">
            	Member
            </div>
            <ul className="friend-list">
                <li className="active bounceInDown">
                	<a href="#" className="clearfix">
                		<img src="https://bootdey.com/img/Content/user_1.jpg" alt="" className="img-circle"/>
                		<div className="friend-name">	
                			<strong>John Doe</strong>
                		</div>
                		<div className="last-message text-muted">Hello, Are you there?</div>
                		<small className="time text-muted">Just now</small>
                		<small className="chat-alert label label-danger">1</small>
                	</a>
                </li>
                <li>
                	<a href="#" className="clearfix">
                		<img src="https://bootdey.com/img/Content/user_2.jpg" alt="" className="img-circle"/>
                		<div className="friend-name">	
                			<strong>Jane Doe</strong>
                		</div>
                		<div className="last-message text-muted">Lorem ipsum dolor sit amet.</div>
                		<small className="time text-muted">5 mins ago</small>
                	<small className="chat-alert text-muted"><i className="fa fa-check"></i></small>
                	</a>
                </li> 
                <li>
                	<a href="#" className="clearfix">
                		<img src="https://bootdey.com/img/Content/user_3.jpg" alt="" className="img-circle"/>
                		<div className="friend-name">	
                			<strong>Kate</strong>
                		</div>
                		<div className="last-message text-muted">Lorem ipsum dolor sit amet.</div>
                		<small className="time text-muted">Yesterday</small>
                		<small className="chat-alert text-muted"><i className="fa fa-reply"></i></small>
                	</a>
                </li>  
                <li>
                	<a href="#" className="clearfix">
                		<img src="https://bootdey.com/img/Content/user_1.jpg" alt="" className="img-circle"/>
                		<div className="friend-name">	
                			<strong>Kate</strong>
                		</div>
                		<div className="last-message text-muted">Lorem ipsum dolor sit amet.</div>
                		<small className="time text-muted">Yesterday</small>
                		<small className="chat-alert text-muted"><i className="fa fa-reply"></i></small>
                	</a>
                </li>     
                <li>
                	<a href="#" className="clearfix">
                		<img src="https://bootdey.com/img/Content/user_2.jpg" alt="" className="img-circle"/>
                		<div className="friend-name">	
                			<strong>Kate</strong>
                		</div>
                		<div className="last-message text-muted">Lorem ipsum dolor sit amet.</div>
                		<small className="time text-muted">Yesterday</small>
                		<small className="chat-alert text-muted"><i className="fa fa-reply"></i></small>
                	</a>
                </li>                        
            </ul>
		</div>
        

    	<div className="col-md-7 bg-white ">
            <div className="chat-message">
                <ul className="chat">
                    <li className="left clearfix">
                    	<span className="chat-img pull-left">
                    		<img src="https://bootdey.com/img/Content/user_3.jpg" alt="User Avatar"/>
                    	</span>
                    	<div className="chat-body">
                    		<div className="header">
                    			<strong className="primary-font">John Doe</strong>
                    			<small className="pull-right text-muted"><i className="fa fa-clock-o"></i> 12 mins ago</small>
                    		</div>
                    		<p>
                    			Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    		</p>
                    	</div>
                    </li>
                    <li className="right clearfix">
                    	<span className="chat-img pull-right">
                    		<img src="https://bootdey.com/img/Content/user_1.jpg" alt="User Avatar"/>
                    	</span>
                    	<div className="chat-body clearfix">
                    		<div className="header">
                    			<strong className="primary-font">Sarah</strong>
                    			<small className="pull-right text-muted"><i className="fa fa-clock-o"></i> 13 mins ago</small>
                    		</div>
                    		<p>
                    			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum ornare dolor, quis ullamcorper ligula sodales at. 
                    		</p>
                    	</div>
                    </li>
                    <li className="left clearfix">
                        <span className="chat-img pull-left">
                    		<img src="https://bootdey.com/img/Content/user_3.jpg" alt="User Avatar"/>
                    	</span>
                    	<div className="chat-body clearfix">
                    		<div className="header">
                    			<strong className="primary-font">John Doe</strong>
                    			<small className="pull-right text-muted"><i className="fa fa-clock-o"></i> 12 mins ago</small>
                    		</div>
                    		<p>
                    			Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    		</p>
                    	</div>
                    </li>
                    <li className="right clearfix">
                        <span className="chat-img pull-right">
                    		<img src="https://bootdey.com/img/Content/user_1.jpg" alt="User Avatar"/>
                    	</span>
                    	<div className="chat-body clearfix">
                    		<div className="header">
                    			<strong className="primary-font">Sarah</strong>
                    			<small className="pull-right text-muted"><i className="fa fa-clock-o"></i> 13 mins ago</small>
                    		</div>
                    		<p>
                    			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum ornare dolor, quis ullamcorper ligula sodales at. 
                    		</p>
                    	</div>
                    </li>                    
                    <li className="left clearfix">
                        <span className="chat-img pull-left">
                    		<img src="https://bootdey.com/img/Content/user_3.jpg" alt="User Avatar"/>
                    	</span>
                    	<div className="chat-body clearfix">
                    		<div className="header">
                    			<strong className="primary-font">John Doe</strong>
                    			<small className="pull-right text-muted"><i className="fa fa-clock-o"></i> 12 mins ago</small>
                    		</div>
                    		<p>
                    			Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    		</p>
                    	</div>
                    </li>
                    <li className="right clearfix">
                        <span className="chat-img pull-right">
                    		<img src="https://bootdey.com/img/Content/user_1.jpg" alt="User Avatar"/>
                    	</span>
                    	<div className="chat-body clearfix">
                    		<div className="header">
                    			<strong className="primary-font">Sarah</strong>
                    			<small className="pull-right text-muted"><i className="fa fa-clock-o"></i> 13 mins ago</small>
                    		</div>
                    		<p>
                    			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum ornare dolor, quis ullamcorper ligula sodales at. 
                    		</p>
                    	</div>
                    </li>
                    <li className="right clearfix">
                        <span className="chat-img pull-right">
                    		<img src="https://bootdey.com/img/Content/user_1.jpg" alt="User Avatar"/>
                    	</span>
                    	<div className="chat-body clearfix">
                    		<div className="header">
                    			<strong className="primary-font">Sarah</strong>
                    			<small className="pull-right text-muted"><i className="fa fa-clock-o"></i> 13 mins ago</small>
                    		</div>
                    		<p>
                    			Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur bibendum ornare dolor, quis ullamcorper ligula sodales at. 
                    		</p>
                    	</div>
                    </li>                    
                </ul>
            </div>
            <div className="chat-box bg-white">
            	<div className="input-group">
            		<input className="form-control border no-shadow no-rounded" placeholder="Type your message here"/>
            		<span className="input-group-btn">
            			<button className="btn btn-success no-rounded" type="button">Send</button>
            		</span>
            	</div>
            </div>            
		</div>        
	</div>
</div>
  )
}

export default SideChats;

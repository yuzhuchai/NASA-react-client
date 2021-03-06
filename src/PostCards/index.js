import React from 'react'
import EditPost from '../EditPost'
import CommentList from '../CommentList'

import { Card, Image, Button, Form, Modal, Comment, Header, Feed, Icon } from 'semantic-ui-react'

class PostCards  extends React.Component {
	// this is a function displaying a list of posts it will be used for all the places that need to display posts by passing down an array of posts.

	constructor(){
		super()
		this.state={
			comment: '',
			displayfrom: false,
			showmodal: false,
			showEditModal: false,
			editPost: null,
			post: null,
			foundComment:[],
			numOfLikes:0
		}
	}

	handleChange= (e) => {
		this.setState({
			[e.target.name]: e.target.value
		})
	}

	updateDeleteComment = (commentId) => {
		const oldComment = this.state.foundComment
		const newComment = oldComment.filter(comment => commentId !== comment._id)		
		this.setState({
			foundComment: newComment
		})
	}

	
	updateComment = (comment) => {
		 this.state.foundComment.push(comment)
		 this.props.increasePlanetHappiness()
	}

	findAllComments = async (postId) => {
		const url = `${process.env.REACT_APP_API_URL}/api/v1/comment/post/${postId}`
		const response = await fetch(url,{
			method: 'GET',
			credentials: 'include'
		})
		const parsedResponse = await response.json()
		console.log(parsedResponse,'<------yes, need to see this ');
		this.setState({
			foundComment: [...parsedResponse.data]
		})
	}


	toggleModal = (post) => {
		this.setState({
			showmodal: false,
			showEditModal: true,
			editPost: post,
		})
		// console.log(post._id,'<-----should be differnet');
	}

	handleModal=(post) => {
		this.setState({
			showmodal: !this.state.showmodal,
			post: post,
			showEditModal: false 
		})
		this.findAllComments(post._id)
	}

	displayFrom = () => {
		this.setState({
			displayfrom: !this.state.displayfrom
		})
	}

	deletePostToggle = (postid) => {
		this.props.deletePost(postid)
		this.closeModal()
	}

	closeModal= () => {
		this.setState({
			showmodal: false,
			showEditModal: false
		})
	}

	handleLike = async (post) => {
		console.log(post.favoritedBy,'<------posertttttt ');
		console.log(this.props.loggedUser,'<----------uasdaskljdasdaksljda');
		const favoritedById = post.favoritedBy.map(user => user._id)

		if (favoritedById.indexOf(this.props.loggedUser._id) === -1){
			console.log(`they are not the same !!!!!`);
			const url = `${process.env.REACT_APP_API_URL}/api/v1/post/like/${post._id}`
			const response = await fetch(url, {
				method: 'PUT',
				credentials: 'include',
			})

			const parsed = await response.json()
			console.log(parsed,'<=======parsedResponse after save');
			this.props.updateUserPosts(parsed.data.editPost, true)
			this.setState({
				post: parsed.data.editPost
			})
		} else {
			console.log(`already liked the post`);
		}

		this.props.increasePlanetHappiness()
	}

	render(){
		console.log(this.props,'<======postcards');
		const postList = this.props.posts.map((post) => {
				console.log(post,'<----- this should be a userOBj ooops  post');
				const subStr = post.content.substring(0,50)
			return(
				<Card key={post._id} style={{width:'100%', margin:'10px auto'}}>
		    		<Card.Content>
				        <Image
				          floated='right'
				          size='mini'
				          src={post.img}
				        />
				        <Card.Header>a message from {post.cat}</Card.Header>
						
						{this.props.loggedUser.username !== post.user.username ?
							<Card.Meta>posted by <strong><a onClick={this.props.goToUserPage.bind(null, post.user)}>{post.user.username}</a></strong> on {post.date}</Card.Meta>
						: 
							<Card.Meta>posted by you on {post.date}</Card.Meta>
						}
				        
				        <Card.Description>
				        	{subStr}...
				        </Card.Description>
			    	</Card.Content>

			    	<Card.Content extra>
			    		<Button onClick={this.handleModal.bind(null,post)}>SHOW POST</Button>
			    		{this.state.post? 
			    		<div>
				    		<Modal size='small' open={this.state.showmodal} onClose={this.closeModal}>
				    			<Modal.Content>
				    				<Image style={{display:'block', margin:'auto'}} size='medium' src={this.state.post.img}/>
				    				<p style={{fontWeight:'bolder'}}>{this.state.post.content}</p>
				    			</Modal.Content>

				    			<Modal.Description>
				    				<div style={{padding: '10px'}}>
			    						{this.props.loggedUser._id === this.state.post.user._id?
			    						<div>
				    						<Button onClick={this.deletePostToggle.bind(null, this.state.post.
				    							_id)}>DELETE POST</Button> 
				    						<Button onClick={this.toggleModal.bind(null, this.state.post)}>EDIT POST</Button>
				    						<Feed.Like><Icon name='like'/>{this.state.post.favoritedBy.length} Likes</Feed.Like>
			    						</div> : 
			    						<Button onClick={this.handleLike.bind(null, this.state.post)}><Icon name='like' />{this.state.post.favoritedBy.length} Likes</Button>}
			    					</div>


				    				<Comment.Group>
					    				<Header as='h3' dividing style={{margin: '10px'}}>
									      Comments
									    </Header>
				    					<CommentList 
				    						editComment={this.editComment} 
				    						loggedUser={this.props.loggedUser}
				    						foundComment={this.state.foundComment}
				    						createComment={this.createComment}
				    						post={this.state.post}
				    						updateComment={this.updateComment}
				    						updateDeleteComment={this.updateDeleteComment}
				    						goToUserPage={this.props.goToUserPage}
				    						/>
				    				</Comment.Group>
				    			</Modal.Description>
				    		</Modal>
				    		</div> : null}

			    		<Modal open={this.state.showEditModal} onClose={this.closeModal}>
			    			<Modal.Content>
			    				<EditPost editPost={this.state.editPost} updateUserPosts={this.props.updateUserPosts} handleEditModal={this.closeModal}/>
			    			</Modal.Content>
			    		</Modal>

				    </Card.Content>
			    </Card>
			)
		})

		return(
			<div className='PostCards'>

				{this.props.loggedUser ? 
					<Card.Group style={{backgroundColor:'rgba(0,0,0,0)', margin:0}}centered>
						{postList}
					</Card.Group>
				:
					null
				}	
			</div>
		)
	}
}

export default PostCards
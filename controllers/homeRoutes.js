const router = require("express").Router();
//const { json } = require("sequelize/types");
const { Blogs, User, Comments } = require("../models");
const withAuth = require("../utils/auth"); //will redirect un-logged in user to login

//render the main page
//--------------------------------------------------------------------------------------
router.get("/", async (req, res) => {
	try {
		//get all blogs and JOIN with user data, specifically the name
		const blogsData = await Blogs.findAll({
			//"Blogs" is exported from models folder //findAll is a sequelize method
			include: [
				{
					model: User, //include the user, limit to name
					attributes: [`name`], //limiting what the database hands to us
				},
			],
		});
		//Serialize data so the handlebars template can read it
		const blogz = blogsData.map((blag) => blag.get({ plain: true }));
		//Pass the werialized data into template

		res.render("homepage", {
			blogz,
			logged_in: req.session.logged_in, //hands the view the logged on status
			//should probably also hand in the logged_in: req.session.logged_in
		});
	} catch (err) {
		res.status(500).json(err);
	}
});

//Render the dashboard
//------------------------------------------------------------------------------------------
router.get("/dash", withAuth, async (req, res) => {
	try {
		//find the logged on user based on the session ID
		console.log(
			`\n\n Hey this is homeRoutes.js and I'm trying to render the dashboard and this is the current UserID: ${JSON.stringify(
				req.session.user_id
			)}\n\n`
		);

		const myBlogsData = await Blogs.findAll({
			where: {
				user_id: req.session.user_id,
			},
		});
		console.log(
			`\n\n HEY!this is homeRoutes.js and I'm trying to render the dashboard and HERE IS THE My Blogs Data: ${JSON.stringify(
				myBlogsData
			)}\n\n`
		);
		const data = {
			logged_in: req.session.logged_in,
			blogs: myBlogsData.map((blog) => blog.get({ plain: true })),
			//the dot map method is looping over each blog and does a dot get (cleans it up, removes the extra sequelize stuff)
		};
		console.log(
			`\n\n HEY these are all your blogs!!! Data: ${JSON.stringify(data)}\n\n`
		);
		res.render("dashboard", { data, logged_in: req.session.logged_in });
	} catch (err) {
		res.status(500).json(err);
	}
});

//render a blog post by id-  is it possible to grab associated comments at the same time?
//------------------------------------------------------------------------------------------
router.get("/post/:id", async (req, res) => {
	try {
		const singleData = await Blogs.findByPk(req.params.id, {
			include: [
				{
					model: User,
					attributes: ["name"],
					model: Comments,
					attributes: ["entry"],
				},
			],
		});
		const single = singleData.get({ plain: true });
		res.render("single", {
			...single,
			//logged_in req.session.logged_in,
		});
		console.log(
			"! ! ! ! The data just passed to single handlebars is : " +
				JSON.stringify(single)
		);
	} catch (err) {
		res.status(500).json(err);
	}
});
//The following is an old attempt to get comments to render
//------------------------------------------------------------------------------------------
// router.get("/post/:id", async (req, res) => {
// 	console.log(
// 		"! ! ! This is homeRoutes, about to TRY to render all comments for this post"
// 	);
// 	try {
// 		const commentData = await Comments.findAll(req.params.id, {
// 			include: [
// 				{
// 					model: Blogs,
// 					attributes: ["id"], //I want to include the id of the blog that the comment belongs to. referred to as blog_id in comment model
// 				},
// 			],
// 			where: { id: id }, //I want all coments where the blog id matches the req.params.id, assuming the req.params.id is what I suspect it is.
// 		});
// 		const comment = commentData.get({ plain: true });
// 		// res.render("comment", {
// 		res.render("single", {
// 			//can I render this in "single" even though thats happening already?
// 			...comment,
// 			//logged_in req.session.logged_in,
// 		});
// 	} catch (err) {
// 		res.status(500).json(err);
// 	}
// });

//Possibly useful- Finding a blog comment by particular id, which might be useful?
//------------------------------------------------------------------------------------------
// router.get("/comment/:id", async (req, res) => {
// 	// comment/:id is the URL of a particular comment
// 	console.log("! ! ! This is homeRoutes, about to TRY to render a comment");
// 	try {
// 		const commentData = await Comments.findByPk(req.params.id, {
// 			include: [
// 				{
// 					model: Blogs,
// 					attributes: ["id"], //I want to include the id of the blog that the comment belongs to. referred to as blog_id in comment model
// 				},
// 			],
// 		});
// 		const comment = commentData.get({ plain: true });
// 		// res.render("comment", {
// 		res.render("somewhere over the rainbow", {
// 			...comment,
// 			//logged_in req.session.logged_in,
// 		});
// 	} catch (err) {
// 		res.status(500).json(err);
// 	}
// });

//------------------------------------------------------------------------------------------

//render the Login Screen: Username, Password, "Login" "Sign Up instead"
//------------------------------------------------------------------------------------------
router.get("/login", (req, res) => {
	// If the user is already logged in, redirect the request to another route
	if (req.session.logged_in) {
		res.redirect("/dash");
		return;
	}

	res.render("login");
});
//---------------------------------------------------------------------------------------------

module.exports = router;

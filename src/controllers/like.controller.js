
const { assertCallExpression } = require('babel-types');
const LikesService = require('../services/like.service.js');
const { ApiError } = require('../utils/apiError');



class LikesController{

   
    LikesService = new LikesService();

    
    getlikelist = async (req, res, next) => {
        try{
            const UserId = res.locals.userId;
            


        }catch{


        }

    }


    

    deletdlike = async (req, res, next) => {


    }



    deletdlike = async (req, res, next) => {


    }






}



module.exports = LikesController;
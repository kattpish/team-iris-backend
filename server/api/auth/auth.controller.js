const Joi = require('joi')
const Account = require('../models/account')

exports.localRegister = async (ctx) => {
    const schema = Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required().min(6)
    })

    const result = Joi.validate(ctx.request.body, schema)

    if(result.error) {
        ctx.status = 400
    }

    let existing = null
    try {
        existing = await Account.findByEmail(ctx.request.body.email)
    } catch(e) {
        throw(500, e)
    }

    if(existing) {
        ctx.status = 409
        ctx.body = 'Email Overlapped'
        return
    }

    let account = null
    try {
        account = await Account.localRegister(ctx.request.body)
    } catch (e) {
        ctx.throw(500, e)
    }
    
    ctx.body = account
}

exports.localLogin = async (ctx) => {
    const schema = Joi.object().keys({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })

    const result = Joi.validate(ctx.request.body, schema)

    if(result.error) {
        ctx.status = 400
        return
    }

    const { email, password } = ctx.request.body

    let account = null
    try {
        account = await Account.findByEmail(email)
    } catch(e) {
        ctx.throw(500, e)
    }

    if(!account || !account.validatePassword(password)) {
        ctx.status = 403
        return
    }

    ctx.body = account
}

exports.exists = async (ctx) => {
    console.log(ctx.params)
    const email = ctx.params.value

    let existing = null
    try {
        existing = await Account.findByEmail(email)
    } catch(e) {
        ctx.throw(500, e)
    }

    ctx.body = {
        exists: existing !== null
    }
}

exports.logout = async (ctx) => {
    ctx.body = 'logout'
}
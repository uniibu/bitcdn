module.exports = router => {
  router.get('/list', async (ctx) => {
    ctx.ok({list:''});
  });
};
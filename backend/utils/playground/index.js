// (async () => {

// const roles = ['admin','IntakeOfficer','SchemeOfficer','ExecutiveSecretary','Account','Legal','PermanentSecretary','Commissioner','Registry','Collection']
// const newRoles = await Promise.all(roles.map(async (role) => {
//   const newRole = new AdminRole({
//     role
//   });
//   await newRole.save();
//   return newRole;
// }));

// console.log(newRoles);
// })()

// (async () => {
// const user = await User.findOneAndUpdate({
//   address: '0x41ba5d2a8efe1a9bc127d7819276f8a0695127cb',

// }, {
//   role: 'admin'
// }, {
//   new: true,

// })

// await user.save()

// console.log(user);

// })()
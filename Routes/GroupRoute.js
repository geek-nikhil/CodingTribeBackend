const express = require('express');
const router = express.Router();
const Group = require('../Schemas/Groups');
const User = require('../Schemas/User');


router.get('/', async (req, res) => {
 res.send('Hello, World!');
});

router.post('/all', async (req, res) => {
    console.log("dada")
    const groupName = req.body.groupName;
  try {
    const groups = await Group.find({groupName});
    res.json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/groups', async (req, res) => {
    try {
      const groups = await Group.find();
      res.json(groups);
    } catch (error) {
      console.error('Error fetching groups:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
router.post('/create', async (req, res) => {
  const { groupName , creator } = req.body;
  try {
    let group = await Group.findOne({ groupName });
    if (!group) {
        group = await Group.create({ groupName , members : [{username : creator , role : "admin"}]});
        res.send('Group created successfully');
    }else{
        throw new Error('group already exists');
    }
}catch (error) {
    console.error('group not found:', error);
    res.status(500).json({ error: 'group not found' });
}
})
router.post('/check', async (req, res) => {
    const { groupName, username } = req.body;
    try {
        const group = await Group.findOne({ groupName });
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }
        const isMember = group.members.some(member => member.username === username);
        console.log(isMember)
        res.json({ isMember });

    } catch (error) {
        console.error('Error checking group membership:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


router.post('/add', async (req, res) => {
    const { groupName, username, role } = req.body;

    // Validate input
    if (!groupName || !username || !role) {
        return res.status(400).json({ error: 'All fields (groupName, username, role) are required.' });
    }

    try {
        // Check if the user exists
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Check if the group exists
        let group = await Group.findOne({ groupName });
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        // Check if the user is already a member of the group
        const isMember = group.members.some(member => member.username === username);
        if (isMember) {
            return res.status(400).json({ error: 'User is already a member of this group.' });
        }

        // Add the user to the group
        group.members.push({ username, role });
        await group.save();

        res.status(200).json({ message: 'Member added successfully', members: group.members });
    } catch (error) {
        console.error('Error adding member to group:', error);
        res.status(500).json({ error: 'An error occurred while adding the member' });
    }
});

router.post('/mess', async (req, res) => {
    const { groupName, message ,user} = req.body;
    try {
        let group = await Group.findOne({ groupName });
        if (!group) {
          console.log("sdfdfds")
        throw new Error('group not found');
      }
    
      group.messages.push({
         message : message,
         sender: user,
         timestamp: new Date()
         });
      await group.save();


    }catch (error) {
        console.error('group not found:', error);
        res.status(500).json({ error: 'group not found' });
      }
      
  
      res.send('Hello, World!');
  });

  router.post('/task', async (req, res) => {
    const { groupName} = req.body;
    try {
        let group = await Group.findOne({ groupName });
        if (!group) {
          console.log("sdfdfds")
        throw new Error('group not found');
      }
      console.log(group.task.date)
      if(!group.task.date){
       res.send(false);
         }
      else{
      res.json({task : group.task});;
      }
        
    }catch (error) {
        console.error('group not found:', error);
        res.status(500).json({ error: 'group not found' });
      }
  })


  router.post('/addtask', async (req, res) => {
    const { groupName, leetcodeCount } = req.body;
    try {
      let group = await Group.findOne({ groupName });
  
      if (!group) {
        console.error("Group not found");
        return res.status(404).json({ error: 'Group not found' });
      }
  
      // Ensure `task` object exists in the group before setting properties
      if (!group.task) {
        group.task = {};
      }
     console.log( "task" + leetcodeCount)
      group.task.date = new Date();
      group.task.tasks = leetcodeCount;
      
      await group.save();
      
      res.json(group.task);
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  });
   
  router.post('/endtask', async (req, res) => {
    const { groupName, username } = req.body;
    console.log("sqmkk")
   try {
     let group = await Group.findOne({ groupName });

     if (!group) {
       console.error("Group not found");
       return res.status(404).json({ error: 'Group not found' });
     }

     // Ensure `task` object exists in the group before setting properties
     if (!group.task) {
       throw new Error('Task not found in the group');
     }
     console.log(group.task.completed)
     group.task.completed.push({username:username})
     await group.save();
    //  console.log(group);
     res.json(group.task);
   }catch (error) {
     res.status(500).json({ error: 'An unexpected error occurred' });
   }
 });



module.exports = router;
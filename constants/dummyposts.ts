import { postType } from "./Types";

export const dummyData: postType[] = [
    {
      postId: '1',
      files: ['https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600'],
      postType: 'IMAGE',
      user: {
        fname: 'John Doe',
        avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600',
        isVerified: true,
        rates: ['excellent', 'good']
      },
      body: 'This is a sample post body. I hope it looks good, also check my insta account guys at wow lol I have none',
      timestamp: Date.now(),
      likes: ['user1', 'user2'],
      comments: [
        {
          commentId: 'c1',
          timestamp: Date.now(),
          text: 'Nice post!',
          user: {
            fname: 'Jane Doe',
            avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=600',
            isVerified: false,
            rates: ['good', 'average']
          }
        }
      ],
      favorites: ['user3'],
      shares: ['user4'],
      postOwner:'1'
    },
    {
      postId: '2',
      postOwner:'2',
      files: ['https://images.pexels.com/photos/383838/pexels-photo-383838.jpeg?auto=compress&cs=tinysrgb&w=600'],
      postType: 'VIDEO',
      user: {
        fname: 'Alice Smith',
        avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=600',
        isVerified: true,
        rates: ['excellent', 'outstanding']
      },
      body: 'Check out this cool video!',
      timestamp: Date.now(),
      likes: ['user5', 'user6'],
      comments: [
        {
          commentId: 'c2',
          timestamp: Date.now(),
          text: 'Amazing!',
          user: {
            fname: 'Bob Brown',
            avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600',
            isVerified: true,
            rates: ['excellent', 'superb']
          }
        }
      ],
      favorites: ['user7'],
      shares: ['user8']
    },
    {
      postId: '3',
      postOwner:'4',
      files: ['https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600'],
      postType: 'IMAGE',
      user: {
        fname: 'Charlie Davis',
        avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=600',
        isVerified: false,
        rates: ['good', 'decent']
      },
      body: 'Lovely day for a walk in the park.',
      timestamp: Date.now(),
      likes: ['user9', 'user10'],
      comments: [
        {
          commentId: 'c3',
          timestamp: Date.now(),
          text: 'Beautiful scenery!',
          user: {
            fname: 'Dana White',
            avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=600',
            isVerified: false,
            rates: ['good', 'average']
          }
        }
      ],
      favorites: ['user11'],
      shares: ['user12']
    }
  ];
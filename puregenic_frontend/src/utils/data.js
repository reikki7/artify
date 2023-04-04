export const userQuery = (userId) => {
  const query = `*[_type == "user" && _id == '${userId}']`;

  return query;
};

export const pinDetailMorePinQuery = (pin) => {
  const query = `*[_type == "pin" && category == '${pin.category}' && _id != '${pin._id}' ]{
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
    save[]{
      _key,
      postedBy->{
        _id,
        userName,
        image
      },
    },
  }`;
  return query;
};

export const categories = [
  {
    name: "Animation",
    image: "https://media.tenor.com/kaRCm9ELxKgAAAAM/menhera-chan-chibi.gif",
  },
  {
    name: "Anime",
    image:
      "https://play-lh.googleusercontent.com/OYlJFC4rf9Lg6kxRPe6JIkHbP5A_51LGtm7bXcOG3xJ5ZQ_gVLOT8Um_Pijcj2NFX0yy",
  },
  {
    name: "Cartoon",
    image:
      "https://static.vecteezy.com/system/resources/previews/004/226/762/original/panda-cartoon-cute-say-hello-panda-animals-illustration-vector.jpg",
  },
  {
    name: "Comic",
    image:
      "https://assets-a1.kompasiana.com/items/album/2022/09/30/images-6336844008a8b53a4365db72.jpeg",
  },
  {
    name: "Design",
    image: "https://www.clipstudio.net/wp-content/uploads/2020/03/0090_016.png",
  },
  {
    name: "Doodle",
    image:
      "https://img.freepik.com/free-vector/abstract-scribble-icons-hand-drawn-doodle-coloring_179234-222.jpg?w=360",
  },
  {
    name: "Fantasy",
    image:
      "https://cdn.pixabay.com/photo/2023/01/06/12/35/ai-generated-7701132_1280.jpg",
  },
  {
    name: "Icon",
    image:
      "https://img.freepik.com/free-vector/funny-set-lovely-stickers_23-2147674468.jpg?w=2000",
  },
  {
    name: "Manipulation",
    image:
      "https://i.pinimg.com/originals/8e/d7/a5/8ed7a5b817e28cb6652d149a96b5f739.jpg",
  },
  {
    name: "Painting",
    image:
      "https://www.artmajeur.com/medias/standard/l/a/lana-frey/artwork/13052189_monday-front.jpg",
  },
  {
    name: "Pixel Art",
    image:
      "https://img.freepik.com/premium-vector/cute-cat-head-pixel-art-style_475147-1418.jpg?w=2000",
  },
  {
    name: "Realism",
    image:
      "https://i.ytimg.com/an/MylfXvXHRdA/16226790373733557410_mq.jpg?v=5f764bae",
  },
  {
    name: "Sci-fi",
    image:
      "https://images.fineartamerica.com/images/artworkimages/mediumlarge/1/1-planet-with-illuminated-network-allan-swart.jpg",
  },
  {
    name: "Sketch",
    image:
      "https://images.unsplash.com/photo-1602738328654-51ab2ae6c4ff?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Mnx8c2tldGNoJTIwYXJ0fGVufDB8fDB8fA%3D%3D&w=1000&q=80",
  },
  {
    name: "Typography",
    image:
      "https://cdn.dribbble.com/users/1338508/screenshots/14887943/media/acfe23e333e7a491719805feb91b06e5.jpg?compress=1&resize=400x300",
  },
  {
    name: "Others",
    image:
      "https://i.pinimg.com/236x/2e/63/c8/2e63c82dfd49aca8dccf9de3f57e8588.jpg",
  },
];

export const searchQuery = (searchTerm) => {
  const query = `*[_type == "pin" && title match '${searchTerm}*' || category match '${searchTerm}*' || about match '${searchTerm}*']{
        image{
          asset->{
            url
          }
        },
            _id,
            destination,
            postedBy->{
              _id,
              userName,
              image
            },
            save[]{
              _key,
              postedBy->{
                _id,
                userName,
                image
              },
            },
          }`;
  return query;
};

export const feedQuery = `*[_type == "pin"] | order(_createdAt desc) {
  image{
    asset->{
    url
    }
  },
    _id,
    destination,
    postedBy->{
        _id,
        userName,
        image
      },
    save[]{
        _key,
        postedBy->{
        _id,
        userName,
        image
        },
      },
    } `;

export const pinDetailQuery = (pinId) => {
  const query = `*[_type == "pin" && _id == '${pinId}']{
    image{
      asset->{
        url
      }
    },
    _id,
    title, 
    about,
    category,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
   save[]{
      postedBy->{
        _id,
        userName,
        image
      },
    },
    comments[]{
      comment,
      _key,
      postedBy->{
        _id,
        userName,
        image
      },
    }
  }`;
  return query;
};

export const userCreatedPinsQuery = (userId) => {
  const query = `*[ _type == 'pin' && userId == '${userId}'] | order(_createdAt desc){
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
    save[]{
      postedBy->{
        _id,
        userName,
        image
      },
    },
  }`;
  return query;
};

export const userSavedPinsQuery = (userId) => {
  const query = `*[_type == 'pin' && '${userId}' in save[].userId ] | order(_createdAt desc) {
    image{
      asset->{
        url
      }
    },
    _id,
    destination,
    postedBy->{
      _id,
      userName,
      image
    },
    save[]{
      postedBy->{
        _id,
        userName,
        image
      },
    },
  }`;
  return query;
};

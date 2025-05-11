import { recursiveVisits, updateCommentRecursively, updateCommentArrayRecursively, normalizeData } from "../libs";
// import fetch from "node-fetch";
// globalThis.fetch = fetch;
import { vi } from "vitest";

vi.stubGlobal("fetch", async () =>
  Promise.resolve({
    json: async () => ({ data: "Mocked data" }),
  })
);

const data = 
{
    "currentUser": {
      "image": { 
        "png": "./images/avatars/image-juliusomo.png",
        "webp": "./images/avatars/image-juliusomo.webp"
      },
      "username": "juliusomo"
    },
    "comments": [
      {
        "id": 1,
        "content": "Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.",
        "createdAt": "1 month ago",
        "score": 12,
        "user": {
          "image": { 
            "png": "./images/avatars/image-amyrobson.png",
            "webp": "./images/avatars/image-amyrobson.webp"
          },
          "username": "amyrobson"
        },
        "replies": []
      },
      {
        "id": 2,
        "content": "Woah, your project looks awesome! How long have you been coding for? I'm still new, but think I want to dive into React as well soon. Perhaps you can give me an insight on where I can learn React? Thanks!",
        "createdAt": "2 weeks ago",
        "score": 5,
        "user": {
          "image": { 
            "png": "./images/avatars/image-maxblagun.png",
            "webp": "./images/avatars/image-maxblagun.webp"
          },
          "username": "maxblagun"
        },
        "replies": [
          {
            "id": 3,
            "content": "If you're still new, I'd recommend focusing on the fundamentals of HTML, CSS, and JS before considering React. It's very tempting to jump ahead but lay a solid foundation first.",
            "createdAt": "1 week ago",
            "score": 4,
            "replyingTo": "maxblagun",
            "replies": [],
            "user": {
              "image": { 
                "png": "./images/avatars/image-ramsesmiron.png",
                "webp": "./images/avatars/image-ramsesmiron.webp"
              },
              "username": "ramsesmiron"
            }
          },
          {
            "id": 4,
            "content": "I couldn't agree more with this. Everything moves so fast and it always seems like everyone knows the newest library/framework. But the fundamentals are what stay constant.",
            "createdAt": "2 days ago",
            "score": 2,
            "replyingTo": "ramsesmiron",
            "replies": [],
            "user": {
              "image": { 
                "png": "./images/avatars/image-juliusomo.png",
                "webp": "./images/avatars/image-juliusomo.webp"
              },
              "username": "juliusomo"
            }
          }
        ]
      }
    ]
  }

  function deepEqual(obj1, obj2, excludeKeys=[]) {
    if (obj1 === obj2) return true; // Same reference
  
    if (typeof obj1 !== "object" || typeof obj2 !== "object" || obj1 === null || obj2 === null)
      return false; // Primitive values or null mismatch
  
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
  
    if (keys1.length !== keys2.length) return false; // Different number of keys
    for(let key of keys1) {
        if(excludeKeys.includes(key) == false) {
            if(!deepEqual(obj1[key], obj2[key], excludeKeys)) return false;
        }
    }
    return true;
  }
  
  function deepArayEqual(arr1, arr2, excludeKeys=[]) {
    for(const elm of arr1) {
        let ok = false;
        for(const elm2 of arr2) {
            if(deepEqual(elm, elm2, excludeKeys)) {
                ok = true;
                break;
            }
        }
        if(!ok) return false;
    }
    return true;
  }
  

describe('recursive procedures', () => {
    it('returns the correct toatl of scores', () => {
        let sum = 0;
        recursiveVisits(data.comments, 
            (comment) => {
                sum += Number(comment.score);
            }
          );
      expect(sum).toBe(23);
    })
    it('returns a set of user names', () => {
        let usernames = [];
        recursiveVisits(data.comments, 
            (comment) => {
                let name = comment.user.username;
                if(!usernames.some(existing => existing === name)){
                    usernames.push(name);
                }
            }
          );
        let correct = ["juliusomo", "amyrobson", "ramsesmiron", "maxblagun"];
        expect((new Set(usernames).size)).toEqual(usernames.length);
        expect(new Set(usernames)).toEqual(new Set(correct));
    });
    it('modifies the username of a comment with a specific id number', ()=> {
        const comments = data.comments.map(comment =>({...comment})); //make a copy
        let original_target = null;
        const targetId = 4;
        recursiveVisits(comments, (comment) => {
            if(comment.id === targetId) 
                original_target = comment;
            });
        const updated = updateCommentRecursively(comments, original_target, 
            (comment)=>{
                return {...comment, user: {...comment.user, username: 'boo'}};
            });
        let updated_target = null;
        recursiveVisits(updated, (comment) => {
            if(comment.id === targetId) 
                updated_target = comment;
            });

        expect(original_target.user.username).toEqual("juliusomo");
        expect(updated_target.user.username).toEqual("boo");
    });
    it('delete a comment without changing the rest of the tree structure', ()=> {
        const comments = data.comments.map(comment =>({...comment})); //make a copy
        let target = null;
        const targetId = 4;
        recursiveVisits(comments, (comment) => {
            if(comment.id === targetId) 
                target = comment;
            });
        const updated = updateCommentArrayRecursively(comments, target, 
            (arr) => arr.filter(a => a != target));
        let updated_target = null;
        recursiveVisits(updated, (comment) => {
            if(comment.id === targetId) 
                updated_target = comment;
            });

        //console.log('updated: ', updated);
        expect(updated_target).toEqual(null);
        expect(deepEqual(comments[0],updated[0])).toEqual(true);
        expect(deepEqual(comments[1],updated[1], ['replies'])).toEqual(true);
        expect(deepEqual(comments[1].replies[0],updated[1].replies[0])).toEqual(true);
        expect(updated[1].replies.length).toEqual(1);
    });

    it('tests normalizeData function.', ()=> {
        const normalized = normalizeData(data);
        const current_user = {
            "image": { 
            "png": "./images/avatars/image-juliusomo.png",
            "webp": "./images/avatars/image-juliusomo.webp"
            },
            "username": "juliusomo"
        }
        expect(deepEqual(normalized.currentUser, current_user)).toEqual(true);

        let users = [];
        recursiveVisits(data.comments, 
            (comment) => {
                let name = comment.user.username;
                if(!users.some(existing => existing.username === name)){
                    users.push(comment.user);
                }
            }
          );
        expect(deepArayEqual(users, normalized.users)).toEqual(true);

        //console.log('data.comments: ', data.comments);
        //console.log('normalized:', normalized.comments);
        expect(deepArayEqual(data.comments, normalized.comments)).toEqual(true);

    });

});


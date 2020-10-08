  const utils = {
    findMatching: (first, otherlist) => {
      console.log('in findMatching');
      var newdic = first.map(data => {
        var dict = {};
        if (otherlist.map(sdata => sdata.id).includes(data.id)) {
          dict = {...data};
          dict['status'] = true;
        } else {
          dict = {...data};
          dict['status'] = false;
        }
        return dict;
      });
      return newdic;
    },
    changeValue: (updated, prev, statusupdate) => {
      try {
        var update_id = updated.map(data => {
          return data.id;
        });
        var updated_data = prev.map(data => {
          if (update_id.includes(data.id)) {
            return {...data, status: statusupdate};
          } else {
            return {...data};
          }
        });
        return updated_data;
      } catch {
        console.log('fuck changevalue');
        return [];
      }
    },
  };
export default utils;

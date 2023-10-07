import {
  staffProjects,
  staffTracks,
  trackFilter,
  getTime,
  getTrackById,
  updateTrack,
  checkTime,
  insertStaffTrack,
  getTimeSheetData,
  submitTimesheetData,
  submitCommonSheetData
} from "../../models/user/trackModel.js";

//staff add tarck
export const addStaffTrack = (req, res) => {
  const data = req.body;
  insertStaffTrack(data, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

//get staff projects
export const projectsforstaff = (req, res) => {
  staffProjects(req.params.id, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.send(results);
    }
  });
};

//get staff tracks
export const tracksforstaff = (req, res) => {
  const data = req.body;
  const page = req.query.pages;
  const size = req.query.size;
  staffTracks(data, page, size, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.send(results);
    }
  });
};

//filter on staff track
export const staff_trackSearch = (req, res) => {
  const data = req.body;
  const page = req.query.pages;
  const size = req.query.size;
  trackFilter(data, page, size, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

//get total time
export const totaltime = (req, res) => {
  const data = req.body;
  getTime(data, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

export const getlasttrack = (req, res) => {
  const data = req.body;
  getTrackById(data, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

export const lasttrackupdate = (req, res) => {
  const data = req.body;
  updateTrack(data, req.params.id, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

export const staffCheckTime = (req, res) => {
  const data = req.body;
  checkTime(data, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

export const staffTimeSheetData = (req, res) => {
  const data = req.body;
  getTimeSheetData(data, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results);
    }
  });
};

export const submitSheetData = (req, res) => {
  const data = req.body;
  submitCommonSheetData(data, (err, results) => {
    if (err) {
      res.send(err);
    } else {
      res.json(results)
    }
  })
}

export const submitTimesheet = (req, res) => {
  const data = req.body;
  submitTimesheetData(data, (err, results) => {
    if(err) {
      res.send(err);
    } else {
      res.json(results);
    }
  })
}

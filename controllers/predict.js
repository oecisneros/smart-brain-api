const clarifai = require("clarifai");
const { sendJson } = require("../core/common");

const handle = () => {
  const faceApi = new clarifai.App({
    apiKey: process.env.API_KEY
  });

  // TODO: Considerar múltiples rostros o ninguno
  const getBoundingBox = response => {
    const face = response.outputs[0].data.regions[0].region_info.bounding_box;
    return {
      left: face.left_col,
      right: face.right_col,
      top: face.top_row,
      bottom: face.bottom_row
    };
  };

  return (req, res) =>
    faceApi.models
      .predict("a403429f2ddf4b49b307e318f00e528b", req.body.input)
      .then(getBoundingBox)
      .then(sendJson(res));
};

module.exports = {
  handle
};
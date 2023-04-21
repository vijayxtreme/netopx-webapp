import Layout from "../Layout/Layout";
import { renderSavedTexts } from "../../lib";
import { Box } from "@mui/material";

function DownloadPage() {
  return (
    <Layout>
      <Box
        sx={{
          textAlign: "left",
        }}
      >
        <h2>Your Downloads</h2>
        <Box>
          <ul style={{ marginTop: `2rem` }}>{renderSavedTexts()}</ul>
        </Box>
      </Box>
      <Box>
        <button
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
        >
          Clear All Downloads
        </button>
      </Box>
    </Layout>
  );
}

export default DownloadPage;

import Loader from '../Loader'
const NoResultFoundModel = ({ name, totalRecords }) => {
  return (
    <div className="noResult">
      <div className="text-center">
        {totalRecords === -1 ? (
          <h5 className="mt-4">
            <Loader /> Loading...
          </h5>
        ) : (
          <h5 className="mt-4">No Data Found</h5>
        )}
      </div>
    </div>
  );
};
export default NoResultFoundModel;

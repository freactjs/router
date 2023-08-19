import { BrowserRouter, Link, Navigate, Outlet, Route, Routes, useNavigate, useParams } from '@/index';
import { FreactNode } from "@freact/core";
import { IMAGES, getImageById } from "./images";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='gallery' element={<Gallery />}>
            <Route path='img/:id' element={<ImageView />} />
          </Route>
        </Route>
        <Route path='*' element={<Navigate to='/' />} />
      </Routes>
    </BrowserRouter>
  );
}

export function Layout() {
  return (
    <div>
      <h1>Outlet Modal Example</h1>
      <p>
        This is a modal example that drives modal displays through URL segments.
        The modal is a child route of its parent and renders in the Outlet.
        This example is taken from <a href='https://github.com/remix-run/react-router/tree/main/examples/modal-route-with-outlet'>React Router</a> to test for feature parity.
      </p>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/gallery">Gallery</Link>
            </li>
          </ul>
        </nav>
        <hr />
      </div>
      <Outlet />
    </div>
  );
}

export function Home() {
  return (
    <div>
      <h2>Home</h2>
      <p>
        Click over to the <Link to="/gallery">Gallery</Link> route to see the
        modal in action
      </p>
      <Outlet />
    </div>
  );
}

export function Gallery() {
  return (
    <div style={{ padding: "0 24px" }}>
      <h2>Gallery</h2>
      <p>
        Click on an image, you'll notice that you still see this route behind
        the modal. The URL will also change as its a child route of{" "}
        <pre style={{ display: "inline" }}>/gallery</pre>{" "}
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "24px",
        }}
      >
        {IMAGES.map((image) => (
          <Link key={image.id} to={`img/${image.id}`}>
            <img
              width={200}
              height={200}
              style={{
                width: "100%",
                aspectRatio: "1 / 1",
                height: "auto",
                borderRadius: "8px",
              }}
              src={image.src}
              alt={image.title}
            />
          </Link>
        ))}
        <Outlet />
      </div>
    </div>
  );
}

export function Dialog({ children, onDismiss }: {
  children: FreactNode;
  onDismiss: () => any;
}) {
  return (
    <div className='dialog' onClick={onDismiss}>
      <div
        className='diag-cont-wrap'
        onClick={(e: Event) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export function ImageView() {
  let navigate = useNavigate();
  let { id } = useParams<{ id: string; }>();
  let image = getImageById(+id);

  function onDismiss() {
    navigate(-1);
  }

  if (!image) {
    return <></>;
    // throw new Error(`No image found with id: ${id}`);
  }

  return (
    <Dialog onDismiss={onDismiss}>
      <div
        style={{
          display: "grid",
          justifyContent: "center",
          padding: "8px 8px",
        }}
      >
        <h1 id="label" style={{ margin: 0 }}>
          {image.title}
        </h1>
        <img
          style={{
            margin: "16px 0",
            borderRadius: "8px",
            width: "100%",
            height: "auto",
          }}
          width={400}
          height={400}
          src={image.src}
          alt=""
        />
        <button
          style={{ display: "block" }}
          onClick={onDismiss}
        >
          Close
        </button>
      </div>
    </Dialog>
  );
}

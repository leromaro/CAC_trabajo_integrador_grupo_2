package controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import data.PlatoDao;
import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.*;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.logging.Logger;
import model.Plato;

@WebServlet("/menu")
@MultipartConfig(
        location = "/media/temp",
        fileSizeThreshold = 1024 * 1024,
        maxFileSize = 1024 * 1024 * 5,
        maxRequestSize = 1024 * 1024 * 10
)
public class platoServletController extends HttpServlet {

    private static final Logger LOGGER = Logger.getLogger(platoServletController.class.getName());

    List<Plato> menu = new ArrayList();
    ObjectMapper mapper = new ObjectMapper();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
        System.out.println("Petición GET");
        String route = req.getParameter("action");
        String id = "";
        byte[] imageBytes;
        try {
            switch (route) {
                case "getAll":
                    System.out.println("Petición GetAll");
                    res.setContentType("application/json; charset=utf-8");
                    menu = PlatoDao.seleccionarTodos();
                    // completo el imageBase64 para mostrar al Front
                    for (Plato plato : menu) {
                        if (plato.getImagen() != null) {
                            imageBytes = plato.getImagen();
                        } else {
                            imageBytes = new byte[0];
                        }
                        String imageBase64 = Base64.getEncoder().encodeToString(imageBytes);
                        plato.setImagenBase64(imageBase64);
                    }
                    // transforma menu a Json y envía al Front
                    mapper.writeValue(res.getWriter(), menu);
                    break;
                case "getDetails":
                    System.out.println("Petición GetDetails");
                    id = req.getParameter("id");
                    Plato platoUpdate = PlatoDao.seleccionarPorId(Integer.parseInt(id));
                    res.setContentType("application/json; charset=utf-8");
                    mapper.writeValue(res.getWriter(), platoUpdate);
                    break;
                case "getById":
                    System.out.println("Petición GetById");
                    id = req.getParameter("id");
                    platoUpdate = PlatoDao.seleccionarPorId(Integer.parseInt(id));
                    res.setContentType("application/json; charset=utf-8");

                    if (platoUpdate.getImagen() != null) {
                        imageBytes = platoUpdate.getImagen();
                    } else {
                        imageBytes = new byte[0];
                    }
<<<<<<< HEAD
                    
=======

>>>>>>> f052988b9235ea51c3b1c0a157fe83c7c2ac3714
                    String imageBase64 = Base64.getEncoder().encodeToString(imageBytes);
                    platoUpdate.setImagenBase64(imageBase64);
                    mapper.writeValue(res.getWriter(), platoUpdate);
                    break;
                default:
                    System.out.println("Parámetro no valido");
            }
            System.out.println("Consulta GET " + route + " realizada con éxito");
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("Error en la operación: " + route + ". " + e.getMessage());
            res.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Error interno del servidor");
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
        System.out.println("Petición POST");
        int platoId = 0;
        String nombre = "";
        String ingredientes = "";
        String tipoPlato = "";
        double precio = 0;
        Part filePart;
        InputStream fileContent;
        byte[] imagenBytes = null;
        Boolean[] checkboxValues;
        checkboxValues = new Boolean[4];
        int respuesta = 0;
        try {
            req.setCharacterEncoding("UTF-8");

            String route = req.getParameter("action");

            switch (route) {
                case "add":
                    System.out.println("Petición add");
                    nombre = req.getParameter("nombre");
                    ingredientes = req.getParameter("ingredientes");
                    tipoPlato = req.getParameter("tipoPlato");
                    precio = Double.parseDouble(req.getParameter("precio"));

                    filePart = req.getPart("imagen");
<<<<<<< HEAD
                    System.out.println(filePart);
=======
>>>>>>> f052988b9235ea51c3b1c0a157fe83c7c2ac3714
                    fileContent = filePart.getInputStream();
                    imagenBytes = fileContent.readAllBytes();

                    // Obtener valores de checkboxes
                    String[] checkboxNames = {"alPlato", "aptoCeliaco", "aptoVegano", "enFalta"};
                    for (int i = 0; i < checkboxNames.length; i++) {
                        String checkboxValue = req.getParameter(checkboxNames[i]);
                        checkboxValues[i] = checkboxValue != null && checkboxValue.equals("true");
                    }

                    Plato nuevoPlato = new Plato(nombre, ingredientes, tipoPlato, precio, imagenBytes, checkboxValues[0], checkboxValues[1], checkboxValues[2], checkboxValues[3]);
                    respuesta = PlatoDao.insertar(nuevoPlato);
                    break;
                case "update":
                    System.out.println("Petición update");
                    platoId = Integer.parseInt(req.getParameter("id"));
                    nombre = req.getParameter("nombre");
                    ingredientes = req.getParameter("ingredientes");
                    tipoPlato = req.getParameter("tipoPlato");
                    precio = Double.parseDouble(req.getParameter("precio"));

                    filePart = req.getPart("imagen");
<<<<<<< HEAD
                    if (filePart.getSize() > 0) {
                        fileContent = filePart.getInputStream();
                        imagenBytes = fileContent.readAllBytes();
                    } else {
                        Plato existingPlato = PlatoDao.seleccionarPorId(platoId);
                        if (existingPlato != null) {
                            imagenBytes = existingPlato.getImagen();
                        }
                    }
=======
                    System.out.println(filePart);
                    fileContent = filePart.getInputStream();
                    imagenBytes = fileContent.readAllBytes();

>>>>>>> f052988b9235ea51c3b1c0a157fe83c7c2ac3714
                    // Obtener valores de checkboxes
                    String[] checkboxNames1 = {"alPlato", "aptoCeliaco", "aptoVegano", "enFalta"};
                    for (int i = 0; i < checkboxNames1.length; i++) {
                        String checkboxValue = req.getParameter(checkboxNames1[i]);
                        checkboxValues[i] = checkboxValue != null && checkboxValue.equals("true");
                    }

                    Plato updatePlato = new Plato(platoId, nombre, ingredientes, tipoPlato, precio, imagenBytes, checkboxValues[0], checkboxValues[1], checkboxValues[2], checkboxValues[3]);
                    respuesta = PlatoDao.actualizar(updatePlato);
                    break;
                case "delete":
                    System.out.println("Petición delete");
                    Plato platoBorrar = PlatoDao.seleccionarPorId(Integer.parseInt(req.getParameter("id")));
                    respuesta = PlatoDao.altaBajaLogica(platoBorrar.isEnFalta(), platoBorrar.getPlatoId());
                    break;
            }
            if (respuesta == 1) {
                res.setStatus(HttpServletResponse.SC_OK);
                System.out.println("Petición POST " + route + " realizada con éxito");
            } else {
                res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                System.out.println("Error en la petición " + route);
            }
        } catch (Exception e) {
            LOGGER.severe("Error al procesar la solicitud: " + e.getMessage());
            e.printStackTrace();
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse res) throws ServletException, IOException {
        System.out.println("Petición DELETE");
        int respuesta = 0;

        try {
            Plato platoBorrar = PlatoDao.seleccionarPorId(Integer.parseInt(req.getParameter("platoId")));
            respuesta = PlatoDao.altaBajaLogica(platoBorrar.isEnFalta(), platoBorrar.getPlatoId());
            if (respuesta == 1) {
                res.setStatus(HttpServletResponse.SC_OK);
                System.out.println("Borrado realizado con éxito");
            } else {
                res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                System.out.println("Error al borrar");
            }
        } catch (Exception e) {
            LOGGER.severe("Error al procesar la solicitud: " + e.getMessage());
            e.printStackTrace();
            res.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }

    }
}

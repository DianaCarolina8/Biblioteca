package com.mitocode.service.impl;

import com.mitocode.model.Libro;
import com.mitocode.repository.ILibroRepo;
import com.mitocode.repository.IGenericRepo;
import com.mitocode.service.ILibroService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class LibroServiceImpl extends CRUDImpl<Libro, Integer> implements ILibroService {

    //@Autowired
    private final ILibroRepo repo;

    @Override
    protected IGenericRepo<Libro, Integer> getRepo() {
        return repo;
    }

}
